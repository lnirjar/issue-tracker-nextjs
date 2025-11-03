import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { TaskViewSwitcher } from "@/components/task-view-switcher";
import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";

export default async function TasksPage({
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
      <TaskViewSwitcher hideProjectFilter={false} />
    </div>
  );
}
