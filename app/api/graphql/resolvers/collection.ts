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
  collections: string[];
}

export const addCollection = async (data: AddCollectionProps) => {
  const { key, name, collections } = data;
  console.log("collections", collections);

  try {
    // Check if all parent collections exist
    const areCollectionsValid = await checkCollectionsExist(collections);
    console.log("areCollectionsValid", areCollectionsValid, collections);
    if (!areCollectionsValid)
      throw new Error("One or more collections do not exist in the database.");

    // Check if name already exist
    const existingCollection = await CollectionModel.findOne({ key });
    if (existingCollection) throw new Error("The name already exist");

    const newCollection = new CollectionModel({
      key,
      name,
      collections,
    });

    console.log(newCollection);
    return (await newCollection.save()) || [];
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
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
    return collection;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};
