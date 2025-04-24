"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceProject } from "@/models/project";
import { GetWorkspaceProjectsResponse } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

interface DeleteProjectResponse {
  project: WorkspaceProject;
}

const deleteProject = async (workspaceId: string, projectId: string) => {
  const response = await axios.delete<DeleteProjectResponse>(
    `/api/workspaces/${workspaceId}/projects/${projectId}`
  );

  return response.data;
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: () => deleteProject(workspaceId, projectId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetWorkspaceProjectsResponse>(
        ["workspace-projects", workspaceId],
        (oldData?: GetWorkspaceProjectsResponse) => {
          const oldProjects = oldData?.projects ?? [];
          const deletedProject = data.project;
          const projects = oldProjects.filter((project) => {
            return project._id.toString() !== deletedProject._id.toString();
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
