import UserModel from "../../models/UserModel";
import ItemModel from "../../models/itemModel";
import { getCollectionsFromKeys } from "./collection";
import { getUserFromContext } from "./user";

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
  data: {
    key: string;
    name: string;
    collections: string[];
    description?: string;
    images?: string[];
    releaseDate?: string;
    releasePlatforms?: {
      name: string;
      url: string;
      price: number;
    }[];
  };
  context: any;
}

export const addItem = async ({ data, context }: AddItemProps) => {
  const {
    key,
    name,
    collections,
    description,
    images = ["/assets/images/no_photo.jpg"],
    releaseDate,
    releasePlatforms = [],
  } = data;
  const user = getUserFromContext(context);

  try {
    const existingItem = await ItemModel.findOne({ key });
    if (existingItem) throw new Error("A Item with that key already exist");

    // Get collections if valid
    const parentCollections = await getCollectionsFromKeys(collections);

    // Data is valid, create the collection
    const newItem = new ItemModel({
      key,
      name,
      description,
      author: user.entity,
      images,
      releaseDate,
      releasePlatforms,
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
