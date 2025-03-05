import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Workspace name is required.",
  }),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;
