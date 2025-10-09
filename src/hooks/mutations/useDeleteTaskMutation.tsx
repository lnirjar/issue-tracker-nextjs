import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task } from "@/models/task";
import { WorkspaceProject } from "@/models/project";
import { User } from "@/models/user";

import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { GetTasksResponse, tasksKey } from "@/hooks/queries/useTasksDataQuery";

interface DeleteTaskResponse {
  task: Omit<Task, "project" | "assignee"> & {
    project: WorkspaceProject;
    assignee: User;
  };
}

const deleteTask = async (workspaceId: string, taskId: string) => {
  const response = await axios.delete<DeleteTaskResponse>(
    `/api/workspaces/${workspaceId}/tasks/${taskId}`
  );

  return response.data;
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(workspaceId, taskId),
    onSuccess: (data) => {
      const projectId = data.task.project.toString();

      queryClient.setQueryData<GetTasksResponse>(
        tasksKey({ workspaceId, projectId }),
        (oldData?: GetTasksResponse) => {
          const oldTasks = oldData?.tasks;
          const deletedTask = data.task;
          if (oldTasks) {
            const filteredTasks = oldTasks.filter((task) => {
              return task._id.toString() !== deletedTask._id.toString();
            });

            return { tasks: filteredTasks };
          }

          return { tasks: [] };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    },
  });
};
