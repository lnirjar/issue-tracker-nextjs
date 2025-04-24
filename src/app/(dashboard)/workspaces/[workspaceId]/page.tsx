import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  await dbConnect();

  const { workspaceId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    notFound();
  }

  return (
    <div>
      <div>Workspace {workspaceId}</div>
    </div>
  );
}
