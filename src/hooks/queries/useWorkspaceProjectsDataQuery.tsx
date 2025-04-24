"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { WorkspaceProject } from "@/models/project";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useEffect, useState } from "react";

export interface GetWorkspaceProjectsResponse {
  projects: WorkspaceProject[];
}

const getWorkpaceProjects = async (workspaceId: string) => {
  const response = await axios.get<GetWorkspaceProjectsResponse>(
    `/api/workspaces/${workspaceId}/projects`
  );

  return response.data;
};

export const useWorkspaceProjectsDataQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: ["workspace-projects", workspaceId],
    queryFn: () => getWorkpaceProjects(workspaceId),
    enabled: isMounted && enabled,
  });
};
