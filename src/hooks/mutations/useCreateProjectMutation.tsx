"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceProject } from "@/models/project";
import { CreateProjectFormData } from "@/schemas/project";
import { GetWorkspaceProjectsResponse } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

interface CreateProjectResponse {
  project: WorkspaceProject;
}

const createProject = async (
  data: CreateProjectFormData,
  workspaceId: string
) => {
  const formData = new FormData();

  formData.append("name", data.name);
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await axios.post<CreateProjectResponse>(
    `/api/workspaces/${workspaceId}/projects`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: (data: CreateProjectFormData) =>
      createProject(data, workspaceId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetWorkspaceProjectsResponse>(
        ["workspace-projects", workspaceId],
        (oldData?: GetWorkspaceProjectsResponse) => {
          const oldProjects = oldData?.projects;
          const newProject = data.project;
          if (oldProjects) {
            return { projects: [...oldProjects, newProject] };
          }

          return { projects: [newProject] };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["workspace-projects", workspaceId],
      });
    },
  });
};
