import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema<Item>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    releaseDate: { type: String },
    images: [{ type: String }],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const ItemModel =
  mongoose.models.Item || mongoose.model<Item>("Item", itemSchema);

export default ItemModel;
