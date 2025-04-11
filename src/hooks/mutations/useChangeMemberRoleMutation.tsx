"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { WorkspaceMember } from "@/models/workspace-member";
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
  return useMutation({
    mutationFn: changeMemberRole,
  });
};
