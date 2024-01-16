import CommentModel from "../../models/CommentModel";
import ItemModel from "../../models/itemModel";

const resolvers = {
  Query: {
    items: async () => {
      console.log("get items");
      try {
        const items = await ItemModel.find();
        return items;
      } catch (error) {
        throw new Error("Error fetching items: " + error.message);
      }
    },
    item: async (_: any, { itemId }: { itemId: string }) => {
      try {
        const item = await ItemModel.findById(itemId);

        if (!item) {
          console.error("Item not found");
          return null;
        }

        return item;
      } catch (error) {
        throw new Error(`Error getting item: ${error.message}`);
      }
    },
    comments: async (_: any, { itemId }: { itemId: string }) => {
      try {
        const item = await ItemModel.findById(itemId);

        if (!item) {
          console.error("Item not found");
          return null;
        }

        const populatedItem = await item.populate({
          path: "comments",
          model: CommentModel,
        });

        return populatedItem.comments;
      } catch (error) {
        throw new Error(`Error getting item: ${error.message}`);
      }
    },
  },
  Mutation: {
    addItem: async (_: any, { itemData }: { itemData: ItemInput }) => {
      console.log("creating items");
      try {
        const newItem = new ItemModel(itemData);
        console.log(newItem);
        return await newItem.save();
      } catch (error) {
        throw new Error(`Error creating item: ${error.message}`);
      }
    },
    addComment: async (
      _: any,
      { itemId, text }: { itemId: string; text: string }
    ) => {
      try {
        const item = await ItemModel.findById(itemId);

        if (!item) {
          console.error("Item not found");
          return null;
        }

        const newComment = new CommentModel({ text });
        await newComment.save();

        item.comments.push(newComment._id);
        await item.save();

        return newComment;
      } catch (error) {
        throw new Error(`Error creating item: ${error.message}`);
      }
    },
  },
  Item: {
    comments: async (parent: any) => {
      await parent.populate({
        path: "comments",
        model: CommentModel,
      });
      return parent.comments;
    },
  },
};

export default resolvers;
