import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  author: { type: String, default: null },
  images: [{ type: String }],
  releaseDate: { type: Date },
  releasePlatforms: {
    type: [
      {
        name: { type: String, required: true },
        url: { type: String },
        price: { type: Number },
      },
    ],
    required: true,
    default: [],
  },
});

const ItemModel = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default ItemModel;
