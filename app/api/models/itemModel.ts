import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema<Item>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    releaseDate: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const ItemModel =
  mongoose.models.Item || mongoose.model<Item>("Item", itemSchema);

export default ItemModel;
