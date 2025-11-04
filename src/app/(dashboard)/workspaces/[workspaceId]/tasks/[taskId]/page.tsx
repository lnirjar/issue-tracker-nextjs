import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { WorkspaceNotFoundAlert } from "@/components/workspace-not-found-alert";
import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";
import { getTaskById } from "@/lib/task";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  await dbConnect();

  const { workspaceId, taskId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    return <WorkspaceNotFoundAlert />;
  }

  if (!Types.ObjectId.isValid(taskId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    return <WorkspaceNotFoundAlert />;
  }

  const task = await getTaskById(taskId);

  if (!task) {
    notFound();
  }

  return <div>Task Details Page {taskId}</div>;
}
