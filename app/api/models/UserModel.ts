import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "user"],
      default: "user",
      required: true,
    },
    picture: { type: String },
    favoriteItems: [{ type: String }],
    favoriteCollections: [{ type: String }],
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
