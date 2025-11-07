"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { CreateWorkspaceFormData } from "@/schemas/workspace";
import { GetUserWorkspacesResponse } from "@/hooks/queries/useUserWorkpacesDataQuery";

interface CreateWorkspaceResponse {
  workspace: Workspace;
}

const createWorkspace = async (data: CreateWorkspaceFormData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await axios.post<CreateWorkspaceResponse>(
    "/api/workspaces",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      queryClient.setQueryData<GetUserWorkspacesResponse>(
        ["workspaces"],
        (oldData?: GetUserWorkspacesResponse) => {
          const oldWorkspaces = oldData?.workspaces;
          const newWorkspace = data.workspace;
          if (oldWorkspaces) {
            return { workspaces: [...oldWorkspaces, newWorkspace] };
          }

          return { workspaces: [newWorkspace] };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
