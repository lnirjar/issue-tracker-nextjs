"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";
import { GetTasksQueryParams } from "@/schemas/task";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

export interface GetTasksResponse {
  tasks: (Omit<Task, "project" | "assignee"> & {
    project: WorkspaceProject;
    assignee: User;
  })[];
}

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
  const projectId = useProjectId();

  return useQuery({
    queryKey: ["tasks", workspaceId, projectId],
    queryFn: () => getTasks(data, workspaceId),
    enabled: isMounted && enabled,
  });
};
