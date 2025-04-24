"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceProject } from "@/models/project";
import { UpdateProjectFormData } from "@/schemas/project";
import { GetWorkspaceProjectsResponse } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

interface UpdateProjectResponse {
  project: WorkspaceProject;
}

const updateProject = async (
  data: UpdateProjectFormData,
  workspaceId: string,
  projectId: string
) => {
  const formData = new FormData();

  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await axios.patch<UpdateProjectResponse>(
    `/api/workspaces/${workspaceId}/projects/${projectId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: (data: UpdateProjectFormData) =>
      updateProject(data, workspaceId, projectId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetWorkspaceProjectsResponse>(
        ["workspace-projects", workspaceId],
        (oldData?: GetWorkspaceProjectsResponse) => {
          const oldProjects = oldData?.projects ?? [];
          const updatedProject = data.project;

          const projects = oldProjects.map((project) => {
            if (project._id.toString() === updatedProject._id.toString()) {
              return updatedProject;
            }
            return project;
          });

          return { projects };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["workspace-projects", workspaceId],
      });
    },
  });
};
