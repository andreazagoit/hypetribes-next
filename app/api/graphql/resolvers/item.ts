import CollectionModel from "../../models/CollectionModel";
import ItemModel from "../../models/itemModel";
import { getCollectionsFromKeys } from "./collection";

interface GetItemProps {
  key: string;
}

export const getItem = async (data: GetItemProps) => {
  const { key } = data;
  try {
    const item = await ItemModel.findOne({ key });

    if (!item) throw new Error(`item not found`);

    return item;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface AddItemProps {
  key: string;
  name: string;
  collections?: string[];
  /* description: string;
  price: number;
  releaseDate: string;
  images: string[];
  collections: string[]; */
}

export const addItem = async (data: AddItemProps) => {
  const {
    key,
    name,
    collections = [] /* description, price, releaseDate, images, collections */,
  } = data;

  try {
    const existingItem = await ItemModel.findOne({ key });
    if (existingItem) throw new Error("A Item with that key already exist");

    // Get collections if valid
    const parentCollections = await getCollectionsFromKeys(collections);

    // Data is valid, create the collection
    const newItem = new ItemModel({
      key,
      name,
    });

    await newItem.save();

    // Save collection key to parents collections
    await Promise.all(
      parentCollections.map(async (collection) => {
        collection.items.push(newItem.key);
        await collection.save();
      })
    );

    return newItem;
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};
