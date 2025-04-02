import mongoose, { InferSchemaType, Schema } from "mongoose";

const workspaceInvitationSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export type WorkspaceInvitation = InferSchemaType<
  typeof workspaceInvitationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const WorkspaceInvitation =
  (mongoose.models
    .WorkspaceInvitation as mongoose.Model<WorkspaceInvitation>) ??
  mongoose.model("WorkspaceInvitation", workspaceInvitationSchema);
