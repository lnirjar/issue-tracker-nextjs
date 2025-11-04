import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { ProjectDetails } from "@/components/project-details";
import { TaskViewSwitcher } from "@/components/task-view-switcher";
import { WorkspaceNotFoundAlert } from "@/components/workspace-not-found-alert";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";
import { getProjectById } from "@/lib/project";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  await dbConnect();

  const { workspaceId, projectId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    return <WorkspaceNotFoundAlert />;
  }

  if (!Types.ObjectId.isValid(projectId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    return <WorkspaceNotFoundAlert />;
  }

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <ProjectDetails />
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
}
