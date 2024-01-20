import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const CategoryModel =
  mongoose.models.Category ||
  mongoose.model<Category>("Category", categorySchema);

export default CategoryModel;
