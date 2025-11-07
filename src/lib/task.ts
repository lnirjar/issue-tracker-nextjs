import "@/models";
import { Task } from "@/models/task";
import { dbConnect } from "@/lib/db";

export const getTaskById = async (taskId: string) => {
  await dbConnect();

  const task = await Task.findById(taskId).exec();
  return task;
};
