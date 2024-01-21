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
      try {
        const collections = await CollectionModel.find({
          collections: { $in: [parent.id] },
        });
        return collections;
      } catch (error: any) {
        throw new Error(
          `Error fetching items for collection: ${error.message}`
        );
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
    const collections = await CollectionModel.find({ key: "movie" });
    return collections;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface GetCollectionProps {
  key: string;
}

const getCollection = async (data: GetCollectionProps) => {
  const { key } = data;
  try {
    const collection = await CollectionModel.findOne({ key });
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
  images: string[];
  collections: string[];
}

const addItem = async (data: AddItemProps) => {
  const { name, description, price, releaseDate, images, collections } = data;

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
      images,
      collections,
    });
    return await newItem.save();
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

interface AddCollectionProps {
  key: string;
  name: string;
  collections: string[];
}
const addCollection = async (data: AddCollectionProps) => {
  const { key, name, collections } = data;

  try {
    const areCollectionsValid = await checkCollectionsExist(collections);

    if (!areCollectionsValid) {
      throw new Error("One or more collections do not exist in the database.");
    }

    const newCollection = new CollectionModel({
      key,
      name,
      collections,
    });
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

  const upcomingMoviesItems = await Promise.all(
    upcomingMovies.results.map(async (result: any) => {
      const item = await addItem({
        name: result.title,
        description: result.overview,
        price: 0,
        releaseDate: result.release_date,
        images: [`https://image.tmdb.org/t/p/original${result.poster_path}`],
        collections: [movieUpcomingCollection.id],
      });
      console.log("RESULT ITEM", item);
      return item;
    })
  );

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
