"use client";

import { endOfDay, isPast } from "date-fns";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { WorkspaceAnalyticsCard } from "@/components/workspace-analytics-card";

import { useTasksDataQuery } from "@/hooks/queries/useTasksDataQuery";
import { useWorkspaceMembersDataQuery } from "@/hooks/queries/useWorkspaceMembersDataQuery";
import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";

import { DONE, UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const WorkspaceAnalyticsCardsContainer = () => {
  const membersQuery = useWorkspaceMembersDataQuery({});
  const projectsQuery = useWorkspaceProjectsDataQuery({});
  const tasksQuery = useTasksDataQuery({});

  const isLoading =
    membersQuery.isPending ||
    membersQuery.isLoading ||
    projectsQuery.isPending ||
    projectsQuery.isLoading ||
    tasksQuery.isPending ||
    tasksQuery.isLoading;

  const isError =
    membersQuery.isError || projectsQuery.isError || tasksQuery.isError;

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
        <Skeleton className="h-36 w-48" />
      </div>
    );
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  const totalMembers = membersQuery.data.members.length;
  const totalProjects = projectsQuery.data.projects.length;
  const totalTasks = tasksQuery.data.tasks.length;
  const completedTasks = tasksQuery.data.tasks.filter(
    (task) => task.status === DONE
  ).length;
  const overdueTasks = tasksQuery.data.tasks.filter(
    (task) => isPast(endOfDay(new Date(task.dueDate))) && task.status !== DONE
  ).length;

  return (
    <ScrollArea>
      <div className="flex gap-2">
        <WorkspaceAnalyticsCard title="Total Members" count={totalMembers} />
        <WorkspaceAnalyticsCard title="Total Projects" count={totalProjects} />
        <WorkspaceAnalyticsCard title="Total Tasks" count={totalTasks} />
        <WorkspaceAnalyticsCard
          title="Completed Tasks"
          count={completedTasks}
        />
        <WorkspaceAnalyticsCard title="Overdue Tasks" count={overdueTasks} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
