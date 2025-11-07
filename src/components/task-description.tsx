"use client";

import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { TaskNotFoundAlert } from "@/components/task-not-found-alert";
import { EditTaskDescriptionForm } from "@/components/edit-task-description-form";

import { useTaskDataQuery } from "@/hooks/queries/useTaskDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

interface TaskDescriptionProps {
  taskId: string;
}

export const TaskDescription = ({ taskId }: TaskDescriptionProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const { data, isLoading, isError, isPending } = useTaskDataQuery({ taskId });

  if (isPending || isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  const task = data.task;

  if (!task) {
    return <TaskNotFoundAlert />;
  }

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const closeEditMode = () => {
    setIsEditMode(false);
  };

  return (
    <Card className="bg-muted shadow-none relative w-full">
      <CardHeader>
        <CardTitle>Description</CardTitle>
        <CardDescription>Description of the task</CardDescription>
        <div className="absolute top-2 right-4">
          <Button
            variant="outline"
            className="w-fit hover:bg-white shadow-none"
            onClick={() => toggleEditMode()}
          >
            {isEditMode ? (
              <>
                <XIcon /> <span>Cancel</span>
              </>
            ) : (
              <>
                <PencilIcon /> <span>Edit</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditMode ? (
          <EditTaskDescriptionForm task={task} closeEditMode={closeEditMode} />
        ) : (
          <div className="text-muted-foreground">
            {task.description || "No description available"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
