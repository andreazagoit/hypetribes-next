import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema<Comment>(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.Comment || mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
