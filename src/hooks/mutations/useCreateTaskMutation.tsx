"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";
import { CreateTaskFormData } from "@/schemas/task";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { GetTasksResponse, tasksKey } from "@/hooks/queries/useTasksDataQuery";

interface CreateTaskResponse {
  task: Omit<Task, "project" | "assignee"> & {
    project: WorkspaceProject;
    assignee: User;
  };
}

const createTask = async (data: CreateTaskFormData, workspaceId: string) => {
  const response = await axios.post<CreateTaskResponse>(
    `/api/workspaces/${workspaceId}/tasks`,
    data
  );

  return response.data;
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (data: CreateTaskFormData) => createTask(data, workspaceId),
    onSuccess: (data) => {
      const projectId = data.task.project._id.toString();

      queryClient.setQueryData<GetTasksResponse>(
        tasksKey({ workspaceId, projectId }),
        (oldData?: GetTasksResponse) => {
          const oldTasks = oldData?.tasks;
          const newTask = data.task;
          if (oldTasks) {
            return { tasks: [...oldTasks, newTask] };
          }

          return { tasks: [newTask] };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    },
  });
};
