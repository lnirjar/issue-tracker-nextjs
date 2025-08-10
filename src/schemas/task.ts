import { z } from "zod";
import { Types } from "mongoose";
import { BACKLOG, DONE, IN_PROGRESS, IN_REVIEW, TODO } from "@/lib/constants";

export const createTaskFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Task name is required." }),
  description: z.string().trim().optional(),
  projectId: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid project id",
    }),
  assigneeId: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid assignee id",
    }),
  dueDate: z.coerce.date({ message: "Due date is required." }),
  status: z.enum([BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE], {
    message: "Status is required.",
  }),
});

export type CreateTaskFormData = z.infer<typeof createTaskFormSchema>;

export const getTasksQuerySchema = z.object({
  projectId: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid project id",
    })
    .optional(),
  assigneeId: z
    .string()
    .trim()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid assignee id",
    })
    .optional(),
  status: z
    .enum([BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE], {
      message: "Invalid status.",
    })
    .optional(),
  dueDate: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type GetTasksQueryParams = z.infer<typeof getTasksQuerySchema>;
