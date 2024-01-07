import { comments } from "../mock/comments";
import { items } from "../mock/items";

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    items: () => items,
    item: (_: any, { id }: { id: string }) => {
      return items.find((item) => item.id === id);
    },
  },
  Mutation: {
    logItem: (_: any, { item }: { item: ItemInput }): Item => {
      // Log the received item to the console
      console.log("Received item:", item);

      // Add logic to create and log the item in your data source
      // For now, return the received item
      /* return item as Item; */
      return {
        id: "1",
        ...item,
        comments: [],
      };
    },
  },
  Item: {
    comments: (parent: Item) => {
      const itemComments = (parent.comments as unknown as string[]).map(
        (commentId) => {
          return comments.find((comment) => comment.id === commentId);
        }
      );
      return itemComments;
    },
  },
};

export default resolvers;
