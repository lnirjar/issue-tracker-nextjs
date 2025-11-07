"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export interface GetTaskResponse {
  task:
    | (Omit<Task, "project" | "assignee"> & {
        project: WorkspaceProject;
        assignee: User;
      })
    | null;
}

export const taskKey = (data: { workspaceId: string; taskId: string }) => {
  const { workspaceId, taskId } = data;

  return ["tasks", workspaceId, taskId] as const;
};

const getTask = async (workspaceId: string, taskId: string) => {
  const response = await axios.get<GetTaskResponse>(
    `/api/workspaces/${workspaceId}/tasks/${taskId}`
  );

  return response.data;
};

export const useTaskDataQuery = ({
  taskId,
  enabled = true,
}: {
  taskId: string;
  enabled?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const workspaceId = useWorkspaceId();

  const queryKey = taskKey({
    workspaceId,
    taskId,
  });

  return useQuery({
    queryKey,
    queryFn: () => getTask(workspaceId, taskId),
    enabled: isMounted && enabled,
  });
};
