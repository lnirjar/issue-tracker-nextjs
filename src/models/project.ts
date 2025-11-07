import mongoose, { InferSchemaType, Schema } from "mongoose";

const workspaceProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export type WorkspaceProject = InferSchemaType<
  typeof workspaceProjectSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const WorkspaceProject =
  (mongoose.models.WorkspaceProject as mongoose.Model<WorkspaceProject>) ??
  mongoose.model("WorkspaceProject", workspaceProjectSchema);
