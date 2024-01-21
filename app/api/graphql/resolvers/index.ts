import CollectionModel from "../../models/CollectionModel";
import CommentModel from "../../models/CommentModel";
import ItemModel from "../../models/itemModel";

const resolvers = {
  Query: {
    items: async () => getItems(),
    item: async (_: any, data: GetItemProps) => getItem(data),
    collections: async () => getCollections(),
    collection: async (_: any, data: GetCollectionProps) => getCollection(data),
    comments: async (_: any, data: GetCommentsProps) => getComments(data),
  },
  Mutation: {
    addItem: async (_: any, data: any) => addItem(data),
    addComment: async (_: any, data: AddCommentProps) => addComment(data),
    addCollection: async (_: any, data: AddCollectionProps) =>
      addCollection(data),
    addTestData: async () => addTestData(),
  },
  Item: {
    comments: async (parent: any) => {
      await parent.populate({
        path: "comments",
        model: CommentModel,
      });
      return parent.comments;
    },
    collections: async (parent: any) => {
      await parent.populate({
        path: "collections",
        model: CollectionModel,
      });
      return parent.collections;
    },
  },
  Collection: {
    items: async (parent: any) => {
      try {
        const items = await ItemModel.find({ collections: { $in: parent.id } });
        return items;
      } catch (error: any) {
        throw new Error(
          `Error fetching items for collection: ${error.message}`
        );
      }
    },
    collections: async (parent: any) => {
      await parent.populate({
        path: "collections",
        model: CollectionModel,
      });
      return parent.collections;
    },
  },
};

export default resolvers;

const getItems = async () => {
  try {
    const items = await ItemModel.find();
    return items;
  } catch (error: any) {
    throw new Error("Error fetching items: " + error.message);
  }
};

interface GetItemProps {
  id: string;
}

const getItem = async (data: GetItemProps) => {
  const { id } = data;
  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      console.error("Item not found");
      return null;
    }

    return item;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

const getCollections = async () => {
  try {
    const collections = await CollectionModel.find();
    return collections;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface GetCollectionProps {
  id: string;
}

const getCollection = async (data: GetCollectionProps) => {
  const { id } = data;
  try {
    const collection = await CollectionModel.findById(id);

    return collection;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface GetCommentsProps {
  id: string;
}

const getComments = async (data: GetCommentsProps) => {
  const { id } = data;
  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      console.error("Item not found");
      return null;
    }

    const populatedItem = await item.populate({
      path: "comments",
      model: CommentModel,
    });

    return populatedItem.comments || [];
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface AddItemProps {
  name: string;
  description: string;
  price: number;
  releaseDate: string;
  collections: string[];
}

const addItem = async (data: AddItemProps) => {
  const { name, description, price, releaseDate, collections } = data;

  const areCollectionsvalid = await checkCollectionsExist(collections);

  if (!areCollectionsvalid) {
    throw new Error("One or more collections do not exist in the database.");
  }

  try {
    const newItem = new ItemModel({
      name,
      description,
      price,
      releaseDate,
      collections,
    });
    return await newItem.save();
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

interface AddCollectionProps {
  name: string;
  collections: string[];
}
const addCollection = async (data: AddCollectionProps) => {
  const { name, collections } = data;
  try {
    const areCollectionsValid = await checkCollectionsExist(collections);

    if (!areCollectionsValid) {
      throw new Error("One or more collections do not exist in the database.");
    }

    const newCollection = new CollectionModel({ name, collections });
    return (await newCollection.save()) || [];
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

interface AddCommentProps {
  id: string;
  text: string;
}
const addComment = async (data: AddCommentProps) => {
  const { id, text } = data;

  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      console.error("Item not found");
      return null;
    }

    const newComment = new CommentModel({ text });
    await newComment.save();

    item.comments.push(newComment._id);
    await item.save();

    return newComment;
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

const addTestData = async () => {
  // Reset database
  await CollectionModel.deleteMany({});
  await ItemModel.deleteMany({});
  await CommentModel.deleteMany({});

  // Add test data
  const collection1 = await addCollection({
    name: "Collection 1",
    collections: [],
  });
  const collection2 = await addCollection({
    name: "Collection 2",
    collections: [collection1.id],
  });
  const collection3 = await addCollection({
    name: "Collection 3",
    collections: [],
  });
  const item1 = await addItem({
    name: "Prodotto 1",
    description: "Descrizione prodotto 1",
    price: 200,
    releaseDate: "20/01/2024",
    collections: [],
  });
  const item2 = await addItem({
    name: "Prodotto 2",
    description: "Descrizione prodotto 2",
    price: 250,
    releaseDate: "20/01/2024",
    collections: [collection1.id],
  });
  const item3 = await addItem({
    name: "Prodotto 2",
    description: "Descrizione prodotto 2",
    price: 250,
    releaseDate: "20/01/2024",
    collections: [collection1.id, collection2.id, collection3.id],
  });

  return {
    collections: [collection1, collection2, collection3],
    items: [item1, item2, item3],
  };
};

const checkCollectionsExist = async (collectionsIds: string[]) => {
  try {
    const existingCollections = await CollectionModel.find({
      _id: { $in: collectionsIds },
    });

    return existingCollections.length === collectionsIds.length;
  } catch (error: any) {
    throw new Error(`Error checking collections: ${error.message}`);
  }
};
