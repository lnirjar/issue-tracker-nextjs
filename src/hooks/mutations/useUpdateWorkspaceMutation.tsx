"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { UpdateWorkspaceFormData } from "@/schemas/workspace";
import { GetUserWorkspacesResponse } from "@/hooks/queries/useUserWorkpacesDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

interface UpdateWorkspaceResponse {
  workspace: Workspace;
}

const updateWorkspace = async (
  data: UpdateWorkspaceFormData,
  workspaceId: string
) => {
  const formData = new FormData();

  if (data.name) {
    formData.append("name", data.name);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await axios.patch<UpdateWorkspaceResponse>(
    `/api/workspaces/${workspaceId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceFormData) =>
      updateWorkspace(data, workspaceId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetUserWorkspacesResponse>(
        ["workspaces"],
        (oldData?: GetUserWorkspacesResponse) => {
          const oldWorkspaces = oldData?.workspaces ?? [];
          const updatedWorkspace = data.workspace;
          const workspaces = oldWorkspaces.map((workspace) => {
            if (workspace._id.toString() === updatedWorkspace._id.toString()) {
              return updatedWorkspace;
            }

            return workspace;
          });

          return { workspaces };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
