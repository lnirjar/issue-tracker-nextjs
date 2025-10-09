import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  await dbConnect();

  const { workspaceId, taskId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  if (!Types.ObjectId.isValid(taskId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    notFound();
  }

  return <div>Task Details Page {taskId}</div>;
}
