"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";
import { GetTasksQueryParams } from "@/schemas/task";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export interface GetTasksResponse {
  tasks: (Omit<Task, "project" | "assignee"> & {
    project: WorkspaceProject;
    assignee: User;
  })[];
}

export const tasksKey = (
  data: GetTasksQueryParams & { workspaceId: string }
) => {
  const { workspaceId, projectId, assigneeId, status, dueDate, search } = data;

  return [
    "tasks",
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
    search,
  ] as const;
};

const getTasks = async (data: GetTasksQueryParams, workspaceId: string) => {
  const response = await axios.get<GetTasksResponse>(
    `/api/workspaces/${workspaceId}/tasks`,
    { params: data }
  );

  return response.data;
};

export const useTasksDataQuery = (
  data: GetTasksQueryParams,
  enabled = true
) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const workspaceId = useWorkspaceId();

  const { projectId, assigneeId, status, dueDate, search } = data;

  const queryKey = tasksKey({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
    search,
  });

  return useQuery({
    queryKey,
    queryFn: () => getTasks(data, workspaceId),
    enabled: isMounted && enabled,
  });
};
