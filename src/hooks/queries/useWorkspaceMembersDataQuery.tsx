"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { User } from "@/models/user";
import { WorkspaceMember } from "@/models/workspace-member";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export interface GetWorkspaceMembersResponse {
  members: (Omit<WorkspaceMember, "user"> & { user: User })[];
}

const getWorkpaceMembers = async (workspaceId: string) => {
  const response = await axios.get<GetWorkspaceMembersResponse>(
    `/api/workspaces/${workspaceId}/members`
  );

  return response.data;
};

export const useWorkspaceMembersDataQuery = ({
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
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkpaceMembers(workspaceId),
    enabled: isMounted && enabled,
  });
};
