import mongoose, { InferSchemaType, Schema } from "mongoose";

import { BACKLOG, DONE, IN_PROGRESS, IN_REVIEW, TODO } from "@/lib/constants";

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "WorkspaceProject",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE],
      required: true,
      default: BACKLOG,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
  },
  { timestamps: true }
);

export type Task = InferSchemaType<typeof taskSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Task =
  (mongoose.models.Task as mongoose.Model<Task>) ??
  mongoose.model("Task", taskSchema);
