import { WorkspaceProject } from "@/models/project";
import { dbConnect } from "@/lib/db";

export const getProjectById = async (projectId: string) => {
  await dbConnect();

  const project = await WorkspaceProject.findById(projectId).exec();
  return project;
};
