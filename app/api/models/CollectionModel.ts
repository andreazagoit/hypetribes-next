import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  collections: [{ type: String }],
  items: [{ type: String }],
});

const CollectionModel =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export default CollectionModel;
