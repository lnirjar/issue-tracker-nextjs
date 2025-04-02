"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";
import { GetUserWorkspacesResponse } from "@/hooks/queries/useUserWorkpacesDataQuery";
import { useInviteId } from "@/app/(dashboard)/invite/hooks/use-invite-id";

interface JoinWorkspaceResponse {
  workspace: Workspace;
}

const joinWorkspace = async (inviteId: string) => {
  const response = await axios.post<JoinWorkspaceResponse>(
    `/api/workspaces/join/${inviteId}`
  );

  return response.data;
};

export const useJoinWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const inviteId = useInviteId();

  return useMutation({
    mutationFn: () => joinWorkspace(inviteId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetUserWorkspacesResponse>(
        ["workspaces"],
        (oldData?: GetUserWorkspacesResponse) => {
          const oldWorkspaces = oldData?.workspaces;
          const newWorkspace = data.workspace;
          if (oldWorkspaces) {
            return { workspaces: [...oldWorkspaces, newWorkspace] };
          }

          return { workspaces: [newWorkspace] };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
