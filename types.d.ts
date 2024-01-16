interface Comment {
  _id: ID!;
  text: String!;
  createdAt: String!;
  updatedAt: String!;
}

interface Item {
  _id: ID!;
  name: String!;
  description: String;
  price: Float;
  releaseDate: String;
  comments: [Comment];
  createdAt: String!;
  updatedAt: String!;
}

interface ItemInput {
  name: string;
  description?: string;
  price?: number;
  releaseDate?: string;
}

interface CommentInput {
  itemId: ID!;
  text: String!;
}
