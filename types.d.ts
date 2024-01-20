interface Comment {
  id: ID!;
  text: String!;
  createdAt: String!;
  updatedAt: String!;
}

interface Category {
  id: ID!;
  name: String!;
  categories: [Category]!;
  items: [Item]!;
}

interface Item {
  id: ID!;
  name: String!;
  description: String;
  price: Float;
  releaseDate: String;
  categories: [Category];
  comments: [Comment];
  createdAt: String!;
  updatedAt: String!;
}
