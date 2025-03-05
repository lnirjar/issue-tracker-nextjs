"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { CreateWorkspaceFormData } from "@/schemas/workspace";

interface CreateWorkspaceResponse {
  workspace: Workspace;
}

const createWorkspace = (data: CreateWorkspaceFormData) => {
  return axios.post<CreateWorkspaceResponse>("/api/workspaces", data);
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
