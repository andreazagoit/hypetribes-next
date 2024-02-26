type APIResponse<T = object> =
  | { success: true; data: T }
  | { success: false; error: string };

interface Comment {
  id: ID!;
  text: String!;
  createdAt: String!;
  updatedAt: String!;
}

interface Collection {
  id: ID!;
  key: string!;
  name: string!;
  collections: [Collection]!;
  items: [Item]!;
}

interface Item {
  id: ID!;
  name: string!;
  description: string;
  price: Float;
  releaseDate: string;
  images: string[];
  collections: [Collection];
  comments: [Comment];
  createdAt: string!;
  updatedAt: string!;
}

interface User {
  id: ID!;
  name: string!;
  email: string!;
  picture: string;
}
