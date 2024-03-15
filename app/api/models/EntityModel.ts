import mongoose, { Schema } from "mongoose";

const entitySchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  picture: { type: String },
  collections: [{ type: String }],
});

const EntityModel =
  mongoose.models.Entity || mongoose.model("Entity", entitySchema);

export default EntityModel;
