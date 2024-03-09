import CollectionModel from "../../models/CollectionModel";
import CommentModel from "../../models/CommentModel";
import UserModel from "../../models/UserModel";
import ItemModel from "../../models/itemModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { addCollection, getCollection, getCollections } from "./collection";
import { addItem, getItem } from "./item";
import { getUser } from "./user";

const resolvers = {
  Query: {
    // ITEMS
    // items: async () => getItems(),
    item: async (_, data) => getItem(data),
    // COLLECTIONS
    // collections: async () => getCollections(),
    collection: async (_, data) => getCollection(data),
    // COMMENTS
    // comments: async (_, data) => getComments(data),
    // USER
    user: async (parent, data, context) => getUser({ context }),
  },
  Mutation: {
    // ITEMS
    addItem: async (_, data) => addItem(data),
    // COMMENTS
    // addComment: async (_, data) => addComment(data),
    // COLLECTIONS
    addCollection: async (_, data) => addCollection(data),
    // TEST
    // addTestData: async () => addTestData(),
    // USER
    // registerWithCredentials: async (_, data) => registerWithCredentials(data),
    // loginWithCredentials: async (_, data) => loginWithCredentials(data),
    // loginWithGoogle: async (_, data) => loginWithGoogle(data),
  },
  Item: {
    comments: async (parent) => {
      await parent.populate({
        path: "comments",
        model: CommentModel,
      });
      return parent.comments;
    },
    collections: async (parent) => {
      await parent.populate({
        path: "collections",
        model: CollectionModel,
      });
      return parent.collections;
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
              _id: null,
              allItems: { $push: "$items" },
            },
          },
          // Unwind the combined items array
          { $unwind: "$allItems" },
          // Replace root to reshape the output
          {
            $replaceRoot: { newRoot: "$allItems" },
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

const addTestData = async () => {
  // Reset database
  await CollectionModel.deleteMany({});
  await ItemModel.deleteMany({});
  await CommentModel.deleteMany({});

  // GET GENRES
  const getGenres = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGE1M2VmNTc5YWYxY2Q4NTE1MGJkN2VmNmM5MGY3MCIsInN1YiI6IjY1YWM4M2VkYmQ1ODhiMDEwYjVjNjVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oV0BquZrShrc67aAa9AVKKMbazDZgNMbiXp8CEUFVNY",
      },
    };

    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en",
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  };
  const { genres } = await getGenres();

  // GET UPCOMING MOVIES
  const getUpcomingMovie = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGE1M2VmNTc5YWYxY2Q4NTE1MGJkN2VmNmM5MGY3MCIsInN1YiI6IjY1YWM4M2VkYmQ1ODhiMDEwYjVjNjVlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oV0BquZrShrc67aAa9AVKKMbazDZgNMbiXp8CEUFVNY",
      },
    };

    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  };

  const upcomingMovies = await getUpcomingMovie();

  // Add test data

  const movieCollection: Collection = await addCollection({
    key: "movie",
    name: "Movies",
    collections: [],
  });

  const movieUpcomingCollection = await addCollection({
    key: "movie-upcoming",
    name: "Upcoming movies",
    collections: [movieCollection.id],
  });

  /* const upcomingMoviesItems = await Promise.all(
    upcomingMovies.results.map(async (result: any) => {
      const item = await addItem({
        name: result.title,
        description: result.overview,
        price: 0,
        releaseDate: result.release_date,
        images: [`https://image.tmdb.org/t/p/original${result.poster_path}`],
        collections: [movieUpcomingCollection.id],
      });
      return item;
    })
  ); */

  // Create a collection for each genre
  const genreCollections = await Promise.all(
    genres.map(async (genre: { id: number; name: string }) => {
      const collection = await addCollection({
        key: `movie-${genre.name.toLocaleLowerCase().split(" ").join("_")}`,
        name: genre.name,
        collections: [movieCollection.id],
      });
      return collection;
    })
  );

  return {
    collections: getCollections(),
    items: [],
  };
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
