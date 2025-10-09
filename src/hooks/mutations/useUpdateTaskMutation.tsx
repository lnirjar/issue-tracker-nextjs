"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";
import { UpdateTaskFormData } from "@/schemas/task";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

interface UpdateTaskResponse {
  task: Omit<Task, "project" | "assignee"> & {
    project: WorkspaceProject;
    assignee: User;
  };
}

const updateTask = async (
  data: UpdateTaskFormData,
  workspaceId: string,
  taskId: string
) => {
  const response = await axios.patch<UpdateTaskResponse>(
    `/api/workspaces/${workspaceId}/tasks/${taskId}`,
    data
  );

  return response.data;
};

export const useUpdateTaskMutation = ({ taskId }: { taskId: string }) => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (data: UpdateTaskFormData) =>
      updateTask(data, workspaceId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    },
  });
};
