import CollectionModel from "../../models/CollectionModel";
import CommentModel from "../../models/CommentModel";
import UserModel from "../../models/UserModel";
import ItemModel from "../../models/itemModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  addCollection,
  getCollection,
  getCollectionTimeline,
} from "./collection";
import { addItem, getItem } from "./item";
import { getUser, getUserFromContext } from "./user";
import EntityModel from "../../models/EntityModel";

const moment = require("moment");

const resolvers = {
  Query: {
    // ITEMS
    // items: async () => getItems(),
    item: async (_, data) => getItem(data),
    // COLLECTIONS
    // collections: async () => getCollections(),
    collection: async (_, data) => getCollection(data),
    collectionTimeline: async (_, data) => getCollectionTimeline(data),
    // COMMENTS
    // comments: async (_, data) => getComments(data),
    // USER
    user: async (parent, data, context) => getUser({ context }),
    entity: async (parent, data, context) => getEntity({ data }),
  },
  Mutation: {
    // ITEMS
    addItem: async (_, data, context) => addItem({ data, context }),
    // COMMENTS
    // addComment: async (_, data) => addComment(data),
    // COLLECTIONS
    addCollection: async (_, data, context) => addCollection({ data, context }),
    addEntity: async (_, data, context) => addEntity({ data, context }),
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
        const entity = await EntityModel.findOne({ key: parent.author });
        return entity;
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
            $sort: { releaseDate: 1 }, // 1 for ascending order, -1 for descending order
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
        const entity = await EntityModel.findOne({ key: parent.author });
        return entity;
      } catch (error) {
        console.error("Error fetching collection author", error);
        throw error;
      }
    },
  },
  User: {
    entity: async (parent: any) => {
      try {
        const entity = await EntityModel.findOne({ key: parent.entity });
        return entity;
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
      key: "movies_romantic",
      name: "Romantic Movies",
      collections: ["movies"],
    },
    {
      key: "movies_adventure",
      name: "Adventure Movies",
      collections: ["movies"],
    },
    {
      key: "movies_commedy",
      name: "Commedy Movies",
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
      releaseDate: moment("2024-03-28T09:00:00").toDate(),
      collections: ["movies_action", "movies_adventure"],
    },
    {
      key: "la-passione-di-dodin-bouffant",
      name: "La passione di Dodin Bouffant",
      description:
        "Le vite e le lotte di Eugenie, stimata cuoca, e Dodin, il buongustaio con cui ha lavorato negli ultimi vent'anni.",
      images: [
        "https://movieplayer.net-cdn.it/t/images/2024/02/20/passion-dodin-bouffant_jpg_400x0_crop_q85.jpg",
      ],
      releaseDate: moment("2024-03-28T09:30:00").toDate(),
      collections: ["movies_romantic"],
    },
    {
      key: "gli-uomini-e-altri-inconvenienti",
      name: "Gli uomini e altri inconvenienti",
      images: [
        "https://m.media-amazon.com/images/M/MV5BMzc2M2M1YzYtMmFhMC00Mzc3LWJjOGEtMTBhYjIzMjhhMGU2XkEyXkFqcGdeQXVyOTU5MDg2OQ@@._V1_.jpg",
      ],
      releaseDate: moment("2024-04-03T09:00:00").toDate(),
      collections: ["movies_commedy"],
    },
    {
      key: "ghostbusters-minaccia-glaciale",
      name: "Ghostbusters - Minaccia glaciale",
      description:
        "Quando la scoperta di un antico artefatto scatena una forza malvagia, gli Acchiappafantasmi vecchi e nuovi devono unire le forze per proteggere la loro casa e salvare il mondo da una seconda era glaciale.",
      images: [
        "https://www.ingenerecinema.com/wp-content/uploads/2023/12/412309022_903470824611981_6033100022399982508_n.jpg",
      ],
      releaseDate: moment("2024-04-11T09:00:00").toDate(),
      collections: ["movies_adventure"],
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

interface AddEntityProps {
  data: {
    key: string;
    name: string;
    bio: string;
    picture: string;
  };
  context?: any;
}

export const addEntity = async ({ data }: AddEntityProps) => {
  const { key, name, bio, picture } = data;

  try {
    // Check if an entity with that key already exists
    const existingEntity = await EntityModel.findOne({ key });
    if (existingEntity) {
      throw new Error(`Entity with key '${key}' already exists.`);
    }

    // Create a new entity
    const newEntity = new EntityModel({
      key,
      name,
      bio,
      picture,
    });
    await newEntity.save();
    return newEntity;
  } catch (error: any) {
    throw new Error(`Error creating entity: ${error.message}`);
  }
};

interface GetEntityProps {
  data: {
    key: string;
  };
}

export const getEntity = async ({ data }: GetEntityProps) => {
  const { key } = data;

  try {
    const entity = EntityModel.findOne({ key });
    return entity;
  } catch (error: any) {
    throw new Error(`Error getting entity: ${error.message}`);
  }
};
