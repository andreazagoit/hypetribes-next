interface Comment {
  id: ID!;
  text: String!;
  createdAt: String!;
  updatedAt: String!;
}

interface Collection {
  id: ID!;
  key: string!;
  name: String!;
  collections: [Collection]!;
  items: [Item]!;
}

interface Item {
  id: ID!;
  name: String!;
  description: String;
  price: Float;
  releaseDate: String;
  collections: [Collection];
  comments: [Comment];
  createdAt: String!;
  updatedAt: String!;
}
