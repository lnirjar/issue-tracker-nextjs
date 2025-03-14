import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { getWorkspaceMember } from "@/lib/workspace";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    notFound();
  }

  return <div>TasksPage {workspaceId}</div>;
}
