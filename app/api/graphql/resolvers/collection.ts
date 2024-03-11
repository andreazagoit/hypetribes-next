import CollectionModel from "../../models/CollectionModel";
import { getUserFromContext } from "./user";

export const getCollections = async () => {
  const mainCollectionsKeys = ["movie", "luxury"];

  try {
    const collections = await CollectionModel.find({
      key: { $in: mainCollectionsKeys },
    });
    return collections;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface AddCollectionProps {
  data: {
    key: string;
    name: string;
    collections?: string[];
  };
  context: any;
}

export const addCollection = async ({ data, context }: AddCollectionProps) => {
  const { key, name, collections = [] } = data;

  const user = getUserFromContext(context);

  try {
    // Check if name already exist
    const existingCollection = await CollectionModel.findOne({ key });
    if (existingCollection)
      throw new Error("A collection with that key already exist");

    // Get collections if valid
    const parentCollections = await getCollectionsFromKeys(collections);

    // Data is valid, create the collection
    const newCollection = new CollectionModel({
      key,
      name,
      author: user.id,
    });

    await newCollection.save();

    // Save collection key to parents collections
    await Promise.all(
      parentCollections.map(async (collection) => {
        collection.collections.push(newCollection.key);
        await collection.save();
      })
    );

    return newCollection;
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

export const getCollectionsFromKeys = async (collectionKeys: string[]) => {
  const collections = await CollectionModel.find({
    key: { $in: collectionKeys },
  });

  if (collections.length !== collectionKeys.length) {
    throw new Error(`Missing some keys`);
  }
  return collections;
};

export const checkCollectionsExist = async (collectionsKeys: string[]) => {
  try {
    const existingCollections = await CollectionModel.find({
      key: { $in: collectionsKeys },
    });

    return existingCollections.length === collectionsKeys.length;
  } catch (error: any) {
    throw new Error(`Error checking collections: ${error.message}`);
  }
};

interface GetCollectionProps {
  key: string;
}

export const getCollection = async (data: GetCollectionProps) => {
  const { key } = data;
  console.log("GETTING COLLECTION", key);
  try {
    const collection = await CollectionModel.findOne({ key });
    if (!collection) throw new Error("No collection with that key found");
    return collection;
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};

export const getCollectionTimeline = async (data: GetCollectionProps) => {
  const { key } = data;
  try {
    const result = await CollectionModel.aggregate([
      // Match the document with the provided collection key
      {
        $match: { key: key },
      },
      // Perform recursive lookup to fetch all items in this collection and its children
      {
        $graphLookup: {
          from: "collections",
          startWith: "$key",
          connectFromField: "collections",
          connectToField: "key",
          as: "childCollections",
          maxDepth: 10, // Adjust the depth as needed to avoid infinite loops
        },
      },
      // Unwind the child collections
      { $unwind: "$childCollections" },
      // Lookup to fetch items in the child collections
      {
        $lookup: {
          from: "items",
          localField: "childCollections.items",
          foreignField: "key",
          as: "items",
        },
      },
      // Unwind the items array
      { $unwind: "$items" },
      // Group to combine all items into a single array
      {
        $group: {
          _id: "$items.key", // Group by a unique identifier field
          item: { $first: "$items" }, // Keep the first occurrence of each item
        },
      },
      // Replace root to reshape the output
      {
        $replaceRoot: { newRoot: "$item" },
      },
      // Add fields if necessary
      {
        $addFields: {
          id: "$_id",
        },
      },
      // Sort by releaseDate
      {
        $sort: { releaseDate: 1 }, // 1 for ascending order, -1 for descending
      },
    ]);

    console.log("RESULTS", result);
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};
