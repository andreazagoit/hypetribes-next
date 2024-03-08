import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  releaseDate: { type: String },
  images: [{ type: String }],
});

const ItemModel = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default ItemModel;
