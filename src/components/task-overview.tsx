"use client";

import { PencilIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { EditTaskModal } from "@/components/edit-task-modal";
import { TaskNotFoundAlert } from "@/components/task-not-found-alert";
import { TaskOverviewProperty } from "@/components/task-overview-property";
import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { TaskDate } from "@/components/TaskDate";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";

import { useTaskDataQuery } from "@/hooks/queries/useTaskDataQuery";
import { useWorkspaceMembersDataQuery } from "@/hooks/queries/useWorkspaceMembersDataQuery";
import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

interface TaskOverviewProps {
  taskId: string;
}

export const TaskOverview = ({ taskId }: TaskOverviewProps) => {
  const { data, isLoading, isError, isPending } = useTaskDataQuery({ taskId });
  const membersQuery = useWorkspaceMembersDataQuery({});
  const projectsQuery = useWorkspaceProjectsDataQuery({});

  if (
    isPending ||
    isLoading ||
    membersQuery.isLoading ||
    membersQuery.isPending ||
    projectsQuery.isLoading ||
    projectsQuery.isPending
  ) {
    return <Skeleton className="h-8 w-64" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  const task = data.task;

  if (!task) {
    return <TaskNotFoundAlert />;
  }

  const project = task.project;
  const assignee = task.assignee;

  return (
    <Card className="bg-muted shadow-none relative w-full">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Overview of the task</CardDescription>
        <div className="absolute top-2 right-4">
          <EditTaskModal task={task}>
            <Button
              variant="outline"
              className="w-fit hover:bg-white shadow-none"
            >
              <PencilIcon /> <span>Edit</span>
            </Button>
          </EditTaskModal>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskOverviewProperty label="Title">
          <span className="text-sm">{task.name}</span>
        </TaskOverviewProperty>
        <TaskOverviewProperty label="Due Date">
          <TaskDate
            date={task.dueDate}
            status={task.status}
            showFullDate={true}
            className="text-sm"
          />
        </TaskOverviewProperty>
        <TaskOverviewProperty label="Assignee">
          <div className="flex gap-2 items-center">
            <WorkspaceAvatar
              name={assignee.name}
              image={assignee.avatar}
              className="size-6"
            />
            <span className="line-clamp-1 text-sm">{assignee.name}</span>
          </div>
        </TaskOverviewProperty>
        <TaskOverviewProperty label="Project">
          <div className="flex gap-2 items-center">
            <WorkspaceAvatar
              name={project.name}
              image={project.image}
              className="size-6"
            />
            <span className="line-clamp-1 text-sm">{project.name}</span>
          </div>
        </TaskOverviewProperty>
        <TaskOverviewProperty label="Status">
          <TaskStatusBadge status={task.status} />
        </TaskOverviewProperty>
      </CardContent>
    </Card>
  );
};
