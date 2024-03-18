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
  key: string!;
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
  email: string!;
  entity: Entity;
  role: "admin" | "editor" | "user";
}

interface Entity {
  key: string;
  name: string;
  bio: string;
  picture: string;
  collections: string[];
}

interface TimelineElement {
  id: string;
  date: string;
  items: Item[];
}
