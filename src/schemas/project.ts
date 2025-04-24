import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Project name is required.",
  }),
  image: z.instanceof(File).optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectFormSchema>;

export const updateProjectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Project name is required.",
    })
    .optional(),
  image: z.instanceof(File).optional(),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectFormSchema>;
