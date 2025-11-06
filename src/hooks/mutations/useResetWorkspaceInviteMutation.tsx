"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceInvitation } from "@/models/workspace-invitation";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

interface ResetWorkspaceInviteResponse {
  invitation: WorkspaceInvitation;
}

const resetWorkspaceInvite = async (workspaceId: string) => {
  const response = await axios.put<ResetWorkspaceInviteResponse>(
    `/api/workspaces/${workspaceId}/invite`
  );

  return response.data;
};

export const useResetWorkspaceInviteMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: () => resetWorkspaceInvite(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitation", workspaceId],
      });
    },
  });
};
