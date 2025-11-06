"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateTaskModal } from "@/components/create-task-modal";
import { DataFilters } from "@/components/data-filters";
import { DataTable } from "@/components/tasks-data-table";
import { columns } from "@/components/task-columns";
import { DataKanban } from "@/components/tasks-data-kanban";
import { DataCalendar } from "@/components/tasks-data-calendar";

import { useTasksDataQuery } from "@/hooks/queries/useTasksDataQuery";
import { useDataFilters } from "@/hooks/useDataFilters";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

import {
  ALL,
  CALENDAR,
  KANBAN,
  TABLE,
  UNKNOWN_ERROR_MESSAGE,
} from "@/lib/constants";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const projectId = useProjectId();
  const [filters, setFilters] = useDataFilters();
  const [view, setView] = useState(TABLE);

  const { status, assigneeId, dueDate } = filters;

  const { data, isLoading, isPending, isError } = useTasksDataQuery({
    projectId: hideProjectFilter
      ? projectId
      : filters.projectId === ALL
      ? undefined
      : filters.projectId,
    status: status === ALL ? undefined : status,
    assigneeId: assigneeId === ALL ? undefined : assigneeId,
    dueDate: dueDate ? dueDate.toUTCString() : undefined,
  });

  if (isLoading || isPending) {
    return (
      <div className="my-4">
        <div className="flex gap-8 h-9">
          <Skeleton className="h-full w-56" />
          <Skeleton className="h-full w-20" />
        </div>
        <div className="flex flex-col sm:flex-row justify-start items-center my-4 gap-2 sm:gap-4">
          <Skeleton className="h-8 w-full sm:w-36" />
          <Skeleton className="h-8 w-full sm:w-36" />
          <Skeleton className="h-8 w-full sm:w-36" />
          {!hideProjectFilter && <Skeleton className="h-8 w-full sm:w-36" />}
        </div>
        <Skeleton className="w-full h-80 my-4" />
      </div>
    );
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  return (
    <Tabs value={view} onValueChange={setView} className="my-4">
      <div className="flex items-center gap-8">
        <TabsList>
          <TabsTrigger value={TABLE}>Table</TabsTrigger>
          <TabsTrigger value={KANBAN}>Kanban</TabsTrigger>
          <TabsTrigger value={CALENDAR}>Calendar</TabsTrigger>
        </TabsList>
        <CreateTaskModal>
          <Button size="sm" variant="secondary">
            <PlusIcon /> New
          </Button>
        </CreateTaskModal>
      </div>
      <div className="my-4">
        <DataFilters
          filters={filters}
          setFilters={setFilters}
          hideProjectFilter={hideProjectFilter}
          view={view}
        />
      </div>
      <TabsContent value={TABLE}>
        <DataTable columns={columns} data={data.tasks} />
      </TabsContent>
      <TabsContent value={KANBAN}>
        <DataKanban data={data} />
      </TabsContent>
      <TabsContent value={CALENDAR}>
        <DataCalendar data={data} />
      </TabsContent>
    </Tabs>
  );
};
