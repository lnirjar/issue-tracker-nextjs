"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { GetUserWorkspacesResponse } from "@/hooks/queries/useUserWorkpacesDataQuery";
import { GetWorkspaceProjectsResponse } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { GetTasksResponse, tasksKey } from "@/hooks/queries/useTasksDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

interface DeleteWorkspaceResponse {
  workspace: Workspace;
}

const deleteWorkspace = async (workspaceId: string) => {
  const response = await axios.delete<DeleteWorkspaceResponse>(
    `/api/workspaces/${workspaceId}`
  );

  return response.data;
};

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: () => deleteWorkspace(workspaceId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetUserWorkspacesResponse>(
        ["workspaces"],
        (oldData?: GetUserWorkspacesResponse) => {
          const oldWorkspaces = oldData?.workspaces ?? [];
          const deletedWorkspace = data.workspace;
          const workspaces = oldWorkspaces.filter((workspace) => {
            return workspace._id.toString() !== deletedWorkspace._id.toString();
          });

          return { workspaces };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      queryClient.setQueryData<GetWorkspaceProjectsResponse>(
        ["workspace-projects", workspaceId],
        () => {
          return { projects: [] };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["workspace-projects", workspaceId],
      });

      queryClient.setQueryData<GetTasksResponse>(
        tasksKey({ workspaceId }),
        () => {
          return { tasks: [] };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    },
  });
};
