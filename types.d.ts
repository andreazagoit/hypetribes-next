interface Item {
  id: string;
  name: string;
  description?: string;
  price?: number;
  releaseDate?: string;
  comments: string[] | Comment[];
}

interface ItemInput {
  name: string;
  description?: string;
  price?: number;
  releaseDate?: string;
}

interface User {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  user: User;
  text: string;
}
