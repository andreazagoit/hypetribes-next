import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema<Collection>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    collections: [{ type: String }],
  },
  { timestamps: true }
);

const CollectionModel =
  mongoose.models.Collection ||
  mongoose.model<Collection>("Collection", collectionSchema);

export default CollectionModel;
