import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { WorkspaceNotFoundAlert } from "@/components/workspace-not-found-alert";
import { TaskBreadcrumbs } from "@/components/task-breadcrumbs";
import { TaskOverview } from "@/components/task-overview";
import { TaskDescription } from "@/components/task-description";
import { DeleteTaskFormCard } from "@/components/delete-task-form-card";

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

  return (
    <div className="flex flex-col gap-8">
      <TaskBreadcrumbs taskId={taskId} />
      <div className="flex flex-col md:flex-row gap-8">
        <TaskOverview taskId={taskId} />
        <TaskDescription taskId={taskId} />
        <DeleteTaskFormCard taskId={taskId} showShadcnButton={true}>
          <Button variant="destructive" className="flex-none">
            <TrashIcon /> <span className="md:sr-only">Delete Task</span>
          </Button>
        </DeleteTaskFormCard>
      </div>
    </div>
  );
}
