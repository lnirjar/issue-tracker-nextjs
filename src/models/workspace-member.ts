import mongoose, { InferSchemaType, Schema } from "mongoose";
import { ADMIN, MEMBER } from "@/lib/constants";

const workspaceMemberSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: [ADMIN, MEMBER],
      required: true,
      default: MEMBER,
    },
  },
  { timestamps: true }
);

workspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

export type WorkspaceMember = InferSchemaType<typeof workspaceMemberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const WorkspaceMember =
  (mongoose.models.WorkspaceMember as mongoose.Model<WorkspaceMember>) ??
  mongoose.model("WorkspaceMember", workspaceMemberSchema);
