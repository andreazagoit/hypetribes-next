const resolvers = {
  Query: {
    hello: () => "Hello world!",
    items: () => [
      {
        id: "1",
        name: "Item 1",
        description: "Description for Item 1",
        price: 19.99,
        releaseDate: "2022-01-01",
      },
      {
        id: "2",
        name: "Item 2",
        description: "Description for Item 2",
        price: 29.99,
        releaseDate: "2022-02-01",
      },
      {
        id: "3",
        name: "Item 1",
        description: "Description for Item 1",
        price: 19.99,
        releaseDate: "2022-01-01",
      },
      {
        id: "4",
        name: "Item 2",
        description: "Description for Item 2",
        price: 29.99,
        releaseDate: "2022-02-01",
      },
    ],
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
      };
    },
  },
};

export default resolvers;
