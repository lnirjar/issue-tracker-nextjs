import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Workspace name is required.",
  }),
  image: z.instanceof(File).optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;

export const updateWorkspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Workspace name is required.",
    })
    .optional(),
  image: z.instanceof(File).optional(),
});

export type UpdateWorkspaceFormData = z.infer<typeof updateWorkspaceFormSchema>;
