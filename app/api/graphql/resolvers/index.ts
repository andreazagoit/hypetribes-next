import CollectionModel from "../../models/CollectionModel";
import CommentModel from "../../models/CommentModel";
import UserModel from "../../models/UserModel";
import ItemModel from "../../models/itemModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { addCollection, getCollection, getCollections } from "./collection";
import { addItem, getItem } from "./item";
import { getUser, getUserFromContext } from "./user";

const resolvers = {
  Query: {
    // ITEMS
    // items: async () => getItems(),
    item: async (_, data) => getItem(data),
    // COLLECTIONS
    // collections: async () => getCollections(),
    collection: async (_, data) => getCollection(data),
    collectionTimeline: async (_, data) => getCollection(data),
    // COMMENTS
    // comments: async (_, data) => getComments(data),
    // USER
    user: async (parent, data, context) => getUser({ context }),
  },
  Mutation: {
    // ITEMS
    addItem: async (_, data, context) => addItem({ data, context }),
    // COMMENTS
    // addComment: async (_, data) => addComment(data),
    // COLLECTIONS
    addCollection: async (_, data, context) => addCollection({ data, context }),
    // TEST
    addTestData: async (parent, data, context) => addTestData({ context }),
    // USER
    // registerWithCredentials: async (_, data) => registerWithCredentials(data),
    // loginWithCredentials: async (_, data) => loginWithCredentials(data),
    // loginWithGoogle: async (_, data) => loginWithGoogle(data),
  },
  Item: {
    /* comments: async (parent) => {
      await parent.populate({
        path: "comments",
        model: CommentModel,
      });
      return parent.comments;
    }, */
    /* collections: async (parent) => {
      await parent.populate({
        path: "collections",
        model: CollectionModel,
      });
      return parent.collections;
    }, */
    author: async (parent: any) => {
      try {
        const user = await UserModel.findById(parent.author);
        return user;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
    },
  },
  Collection: {
    items: async (parent) => {
      try {
        const result = await CollectionModel.aggregate([
          // Match the document with the provided collection key
          {
            $match: { key: parent.key },
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
          {
            $addFields: {
              id: "$_id",
            },
          },
        ]);

        return result;
      } catch (error: any) {
        throw new Error(
          `Error fetching items for collection: ${error.message}`
        );
      }
    },
    collections: async (parent: any) => {
      try {
        const collections = await CollectionModel.find({
          key: { $in: parent.collections },
        });
        return collections;
      } catch (error) {
        console.error("Error fetching collections:", error);
        throw error;
      }
    },
    author: async (parent: any) => {
      try {
        const user = await UserModel.findById(parent.author);
        return user;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
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

const addTestData = async ({ context }) => {
  const user = getUserFromContext(context);

  // Reset database
  await CollectionModel.deleteMany({});
  await ItemModel.deleteMany({});
  await CommentModel.deleteMany({});

  const collectionsToAdd = [
    { key: "luxury", name: "Luxury" },
    { key: "gucci", name: "Gucci", collections: ["luxury"] },
    { key: "dior", name: "Dior", collections: ["luxury"] },
    { key: "movies", name: "Movies" },
    { key: "movies_horror", name: "Horror Movies", collections: ["movies"] },
    { key: "movies_action", name: "Action Movies", collections: ["movies"] },
    {
      key: "movies_adventure",
      name: "Adventure Movies",
      collections: ["movies"],
    },
  ];

  for (const collection of collectionsToAdd) {
    await addCollection({ data: collection, context });
  }

  const itemsToAdd = [
    {
      key: "godzilla-e-kong-il-nuovo-impero",
      name: "Godzilla e Kong - Il nuovo impero",
      description:
        "Due antichi titani, Godzilla e Kong, si scontrano in un'epica battaglia mentre gli umani svelano le loro origini intrecciate e il loro legame con i misteri dell'Isola del Teschio.",
      images: ["https://pad.mymovies.it/filmclub/2022/11/017/locandina.jpg"],
      releaseDate: "28-03-2024",
      collections: ["movies_action", "movies_adventure"],
    },
    { key: "gucci-item-2", name: "Gucci 1", collections: ["gucci"] },
    { key: "gucci-item-3", name: "Gucci 1", collections: ["gucci"] },
  ];

  for (const item of itemsToAdd) {
    await addItem({ data: item, context });
  }

  return "done";
};

interface RegisterWithCredentialsProps {
  name: string;
  email: string;
  password: string;
}
const registerWithCredentials = async (data: RegisterWithCredentialsProps) => {
  const { name, email, password } = data;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error(`The user exist`);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with hashed password
  const newUser = new UserModel({
    name,
    email,
    credentials: { password: hashedPassword },
  });
  await newUser.save();

  // Generate JWT
  const token = jwt.sign({ userId: newUser._id }, "your_secret_key", {
    expiresIn: "1h",
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    token,
  };
};

interface LoginWithCredentialsProps {
  email: string;
  password: string;
}
const loginWithCredentials = async (data: LoginWithCredentialsProps) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error(`User not found`);
  }

  // Check if the password matches
  const isPasswordValid = await bcrypt.compare(
    password,
    user.credentials.password
  );

  if (!isPasswordValid) {
    throw new Error(`Invalid password`);
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id }, "your_secret_key", {
    expiresIn: "1h",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: token,
  };
};
