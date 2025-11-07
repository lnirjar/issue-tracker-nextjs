"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspaceMember } from "@/models/workspace-member";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { GetWorkspaceMembersResponse } from "@/hooks/queries/useWorkspaceMembersDataQuery";

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
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: deleteWorkspaceMember,
    onSuccess: (data) => {
      queryClient.setQueryData<GetWorkspaceMembersResponse>(
        ["workspace-members", workspaceId],
        (oldData?: GetWorkspaceMembersResponse) => {
          const oldMembers = oldData?.members ?? [];
          const deletedMember = data.member;
          const members = oldMembers.filter((member) => {
            return member._id.toString() !== deletedMember._id.toString();
          });

          return { members };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["workspace-members", workspaceId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    },
  });
};
