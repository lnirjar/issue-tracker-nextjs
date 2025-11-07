"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { WorkspaceInvitation } from "@/models/workspace-invitation";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export interface GetWorkspaceInvitationResponse {
  invitation: WorkspaceInvitation | null;
}

const getWorkspaceInvitation = async (workspaceId: string) => {
  const response = await axios.get<GetWorkspaceInvitationResponse>(
    `/api/workspaces/${workspaceId}/invite`
  );

  return response.data;
};

export const useWorkspaceInvitationDataQuery = ({
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
    queryKey: ["invitation", workspaceId],
    queryFn: () => getWorkspaceInvitation(workspaceId),
    enabled: isMounted && enabled,
  });
};
