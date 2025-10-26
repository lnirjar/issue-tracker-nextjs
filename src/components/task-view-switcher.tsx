"use client";

import { PlusIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateTaskModal } from "@/components/create-task-modal";
import { DataFilters } from "@/components/data-filters";
import { DataTable } from "@/components/tasks-data-table";
import { columns } from "@/components/task-columns";
import { DataKanban } from "@/components/tasks-data-kanban";

import { useTasksDataQuery } from "@/hooks/queries/useTasksDataQuery";
import { useDataFilters } from "@/hooks/useDataFilters";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

import { ALL, UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const TaskViewSwitcher = () => {
  const projectId = useProjectId();
  const [filters, setFilters] = useDataFilters();

  const { status, assigneeId, dueDate } = filters;

  const { data, isLoading, isPending, isError } = useTasksDataQuery({
    projectId,
    status: status === ALL ? undefined : status,
    assigneeId: assigneeId === ALL ? undefined : assigneeId,
    dueDate: dueDate ? dueDate.toUTCString() : undefined,
  });

  if (isLoading || isPending) {
    return <Skeleton className="w-full h-40" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  return (
    <Tabs defaultValue="table" className="my-4">
      <div className="flex items-center gap-8">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
          hideProjectFilter={true}
        />
      </div>
      <TabsContent value="table">
        <DataTable columns={columns} data={data.tasks} />
      </TabsContent>
      <TabsContent value="kanban">
        <DataKanban data={data} />
      </TabsContent>
      <TabsContent value="calendar">{JSON.stringify(data.tasks)}</TabsContent>
    </Tabs>
  );
};
