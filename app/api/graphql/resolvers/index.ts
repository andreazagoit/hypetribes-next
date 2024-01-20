import CategoryModel from "../../models/CategoryModel";
import CommentModel from "../../models/CommentModel";
import ItemModel from "../../models/itemModel";

const resolvers = {
  Query: {
    items: async () => getItems(),
    item: async (_: any, data: GetItemProps) => getItem(data),
    categories: async () => getCategories(),
    category: async (_: any, data: GetCategoryProps) => getCategory(data),
    comments: async (_: any, data: GetCommentsProps) => getComments(data),
  },
  Mutation: {
    addItem: async (_: any, data: any) => addItem(data),
    addComment: async (_: any, data: AddCommentProps) => addComment(data),
    // collection
    addCategory: async (_: any, data: AddCategoryProps) => addCategory(data),
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
    categories: async (parent: any) => {
      await parent.populate({
        path: "categories",
        model: CategoryModel,
      });
      return parent.categories;
    },
  },
  Category: {
    items: async (parent: any) => {
      try {
        const items = await ItemModel.find({ categories: { $in: parent.id } });
        return items;
      } catch (error: any) {
        throw new Error(`Error fetching items for category: ${error.message}`);
      }
    },
    categories: async (parent: any) => {
      await parent.populate({
        path: "categories",
        model: CategoryModel,
      });
      return parent.categories;
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

const getCategories = async () => {
  try {
    const categories = await CategoryModel.find();

    return categories;
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`);
  }
};

interface GetCategoryProps {
  id: string;
}

const getCategory = async (data: GetCategoryProps) => {
  const { id } = data;
  try {
    const category = await CategoryModel.findById(id);

    return category;
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
  categories: string[];
}

const addItem = async (data: AddItemProps) => {
  const { name, description, price, releaseDate, categories } = data;

  const areCategoriesValid = await checkCategoriesExist(categories);

  if (!areCategoriesValid) {
    throw new Error("One or more categories do not exist in the database.");
  }

  try {
    const newItem = new ItemModel({
      name,
      description,
      price,
      releaseDate,
      categories,
    });
    return await newItem.save();
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};

interface AddCategoryProps {
  name: string;
  categories: string[];
}
const addCategory = async (data: AddCategoryProps) => {
  const { name, categories } = data;
  try {
    const areCategoriesValid = await checkCategoriesExist(categories);

    if (!areCategoriesValid) {
      throw new Error("One or more categories do not exist in the database.");
    }

    const newCategory = new CategoryModel({ name, categories });
    return (await newCategory.save()) || [];
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
  await CategoryModel.deleteMany({});
  await ItemModel.deleteMany({});
  await CommentModel.deleteMany({});

  // Add test data
  const category1 = await addCategory({
    name: "Category 1",
    categories: [],
  });
  const category2 = await addCategory({
    name: "Category 2",
    categories: [category1.id],
  });
  const category3 = await addCategory({ name: "Category 3", categories: [] });
  const item1 = await addItem({
    name: "Prodotto 1",
    description: "Descrizione prodotto 1",
    price: 200,
    releaseDate: "20/01/2024",
    categories: [],
  });
  const item2 = await addItem({
    name: "Prodotto 2",
    description: "Descrizione prodotto 2",
    price: 250,
    releaseDate: "20/01/2024",
    categories: [category1.id],
  });
  const item3 = await addItem({
    name: "Prodotto 2",
    description: "Descrizione prodotto 2",
    price: 250,
    releaseDate: "20/01/2024",
    categories: [category1.id, category2.id, category3.id],
  });

  return {
    categories: [category1, category2, category3],
    items: [item1, item2, item3],
  };
};

const checkCategoriesExist = async (categoryIds: string[]) => {
  try {
    // Find categories with the specified ids in the database
    const existingCategories = await CategoryModel.find({
      _id: { $in: categoryIds },
    });

    // Check if the number of existing categories matches the input categoryIds length
    return existingCategories.length === categoryIds.length;
  } catch (error: any) {
    // Handle the error (e.g., log it or throw a specific error)
    throw new Error(`Error checking categories: ${error.message}`);
  }
};
