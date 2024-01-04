interface Item {
  id: string;
  name: string;
  description?: string;
  price?: number;
  releaseDate?: string;
}

interface ItemInput {
  name: string;
  description?: string;
  price?: number;
  releaseDate?: string;
}
