import { z } from "zod";

export const createWorkspaceFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Workspace name is required.",
  }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;
