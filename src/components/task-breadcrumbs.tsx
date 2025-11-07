"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { useTaskDataQuery } from "@/hooks/queries/useTaskDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

interface TaskBreadcrumbsProps {
  taskId: string;
}

export const TaskBreadcrumbs = ({ taskId }: TaskBreadcrumbsProps) => {
  const { data, isLoading, isError, isPending } = useTaskDataQuery({ taskId });

  if (isPending || isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  const task = data.task;
  const project = data.task?.project;
  const projectURL = `/workspaces/${project?.workspace.toString()}/projects/${project?._id.toString()}`;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={projectURL}>
            <div className="flex gap-2 items-center">
              <WorkspaceAvatar
                name={project?.name || ""}
                image={project?.image}
                className="size-6"
              />
              <span className="truncate">{data.task?.project.name || ""}</span>
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{task?.name || ""}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
