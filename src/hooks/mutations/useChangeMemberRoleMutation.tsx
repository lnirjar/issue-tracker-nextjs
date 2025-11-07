"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceMember } from "@/models/workspace-member";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { Role } from "@/lib/constants";

interface ChangeMemberRoleResponse {
  member: WorkspaceMember;
}

const changeMemberRole = async ({
  workspaceId,
  memberId,
  role,
}: {
  workspaceId: string;
  memberId: string;
  role: Role;
}) => {
  const response = await axios.patch<ChangeMemberRoleResponse>(
    `/api/workspaces/${workspaceId}/members/${memberId}`,
    { role }
  );

  return response.data;
};

export const useChangeMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: changeMemberRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });
    },
  });
};
