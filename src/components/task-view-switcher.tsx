"use client";

import { PlusIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateTaskModal } from "@/components/create-task-modal";
import { useTasksDataQuery } from "@/hooks/queries/useTasksDataQuery";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";
import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const TaskViewSwitcher = () => {
  const projectId = useProjectId();

  const { data, isLoading, isPending, isError } = useTasksDataQuery({
    projectId,
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
      <div className="my-4">Data Filters</div>
      <TabsContent value="table">{JSON.stringify(data.tasks)}</TabsContent>
      <TabsContent value="kanban">{JSON.stringify(data.tasks)}</TabsContent>
      <TabsContent value="calendar">{JSON.stringify(data.tasks)}</TabsContent>
    </Tabs>
  );
};
