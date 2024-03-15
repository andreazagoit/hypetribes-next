import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: String, default: null },
  collections: [{ type: String }],
  items: [{ type: String }],
});

const CollectionModel =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export default CollectionModel;
