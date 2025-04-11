"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { WorkspaceMember } from "@/models/workspace-member";

interface DeleteWorkspaceMemberResponse {
  member: WorkspaceMember;
}

const deleteWorkspaceMember = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) => {
  const response = await axios.delete<DeleteWorkspaceMemberResponse>(
    `/api/workspaces/${workspaceId}/members/${memberId}`
  );

  return response.data;
};

export const useDeleteWorkspaceMemberMutation = () => {
  return useMutation({
    mutationFn: deleteWorkspaceMember,
  });
};
