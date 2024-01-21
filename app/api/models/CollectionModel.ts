import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema<Collection>(
  {
    name: { type: String, required: true },
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  },
  { timestamps: true }
);

const CollectionModel =
  mongoose.models.Collection ||
  mongoose.model<Collection>("Collection", collectionSchema);

export default CollectionModel;
