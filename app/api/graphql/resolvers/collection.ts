import CollectionModel from "../../models/CollectionModel";

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
  key: string;
  name: string;
  collections?: string[];
}

export const addCollection = async (data: AddCollectionProps) => {
  const { key, name, collections = [] } = data;

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
  try {
    const collection = await CollectionModel.findOne({ key });
    if (!collection) throw new Error("No collection with that key found");
    return collection;
  } catch (error: any) {
    throw new Error(`Error getting collection: ${error.message}`);
  }
};
