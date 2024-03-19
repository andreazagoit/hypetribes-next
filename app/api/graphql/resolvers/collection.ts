import { getCurrentUser } from "@/lib/userServices";
import CollectionModel from "../../models/CollectionModel";
import { getUserFromContext } from "./user";
import EntityModel from "../../models/EntityModel";

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

interface AddCollectionFromUserProps {
  data: {
    key: string;
    name: string;
    collections?: string[];
  };
  context: any;
}

export const addCollectionFromUser = async ({
  data,
  context,
}: AddCollectionFromUserProps) => {
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
      author: user.entity,
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

interface AddCollectionProps {
  data: {
    key: string;
    name: string;
    collections?: string[];
  };
  entity: string;
}

export const AddCollection = async ({ data, entity }: AddCollectionProps) => {
  const { key, name } = data;

  try {
    // Data is valid, create the collection
    const newCollection = new CollectionModel({
      key,
      name,
      author: entity,
    });

    await newCollection.save();

    return newCollection;
  } catch (error: any) {
    throw new Error(`Error creating collection: ${error.message}`);
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
  data: {
    key: string;
  };
  context?: any;
}

export const getCollection = async ({ data, context }: GetCollectionProps) => {
  const { key } = data;

  try {
    const collection = await CollectionModel.findOne({ key });
    if (!collection) throw new Error("No collection with that key found");
    return collection;
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};

interface GetCollectionTimelineProps {
  data: {
    key: string;
  };
  context?: any;
}

export const getCollectionTimeline = async ({
  data,
}: GetCollectionTimelineProps) => {
  const { key } = data;
  try {
    const result = await CollectionModel.aggregate([
      // Match the document with the provided collection key
      {
        $match: { key },
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
      // Remove duplicates before grouping
      {
        $group: {
          _id: "$items._id", // Group by item ID to remove duplicates
          id: { $first: "$items._id" }, // Keep one ID for each group
          items: { $addToSet: "$items" }, // Add items to a set to remove duplicates
        },
      },
      // Unwind the grouped items
      { $unwind: "$items" },
      // Sort items by releaseDate
      { $sort: { "items.releaseDate": 1 } },
      // Group items by their releaseDate
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$items.releaseDate" },
          },
          id: {
            $first: {
              $dateToString: { format: "%Y-%m-%d", date: "$items.releaseDate" },
            },
          },
          date: { $first: "$items.releaseDate" },
          items: {
            $push: { $mergeObjects: ["$items", { id: "$items._id" }] },
          },
        },
      },

      // Sort the result by releaseDate
      { $sort: { date: 1 } },
    ]);

    return result;
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};

interface FollowCollectionProps {
  data: {
    key: string;
  };
  context: any;
}

export const followCollection = async ({
  data,
  context,
}: FollowCollectionProps) => {
  const { key } = data;
  const user = getUserFromContext(context);

  try {
    const foundCollction = await CollectionModel.findOne({ key });
    if (!foundCollction) throw new Error(`Collection missing`);
    const mainCollection = await CollectionModel.findOne({
      key: `@${user.entity}`,
    });
    if (!mainCollection) {
      throw new Error("Main collection not found.");
    }

    // Check if the key is already present in the mainCollection.collections array
    const collectionIndex = mainCollection.collections.indexOf(key);

    if (collectionIndex === -1) {
      // If the key is not present, add it to the collections array
      await CollectionModel.updateOne(
        { key: `@${user.entity}` },
        { $addToSet: { collections: key } }
      );
    } else {
      // If the key is already present, remove it from the collections array
      await CollectionModel.updateOne(
        { key: `@${user.entity}` },
        { $pull: { collections: key } }
      );
    }

    return foundCollction;
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};
