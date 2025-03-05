"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { CreateWorkspaceFormData } from "@/schemas/workspace";

interface CreateWorkspaceResponse {
  workspace: Workspace;
}

const createWorkspace = (data: CreateWorkspaceFormData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  if (data.image) {
    formData.append("image", data.image);
  }

  return axios.post<CreateWorkspaceResponse>("/api/workspaces", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
