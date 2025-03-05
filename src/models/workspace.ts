import mongoose, { InferSchemaType, Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export type Workspace = InferSchemaType<typeof workspaceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Workspace =
  (mongoose.models.Workspace as mongoose.Model<Workspace>) ??
  mongoose.model("Workspace", workspaceSchema);
