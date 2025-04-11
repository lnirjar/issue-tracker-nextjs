"use client";

import {
  EllipsisVerticalIcon,
  LogOutIcon,
  UserCogIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useChangeMemberRoleMutation } from "@/hooks/mutations/useChangeMemberRoleMutation";
import { useDeleteWorkspaceMemberMutation } from "@/hooks/mutations/useDeleteWorkspaceMemberMutation";
import { GetUserWorkspacesResponse } from "@/hooks/queries/useUserWorkpacesDataQuery";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ADMIN,
  CHANGE_MEMBER_ROLE_ERROR_MESSAGE,
  CHANGE_MEMBER_ROLE_LOADING_MESSAGE,
  CHANGE_MEMBER_ROLE_SUCCESS_MESSAGE,
  LEAVE_WORKSPACE_ERROR_MESSAGE,
  LEAVE_WORKSPACE_LOADING_MESSAGE,
  LEAVE_WORKSPACE_SUCCESS_MESSAGE,
  MEMBER,
  REMOVE_WORKSPACE_MEMBER_ERROR_MESSAGE,
  REMOVE_WORKSPACE_MEMBER_LOADING_MESSAGE,
  REMOVE_WORKSPACE_MEMBER_SUCCESS_MESSAGE,
  Role,
} from "@/lib/constants";

export const WorkspaceMemberActionsDropdown = ({
  userMember,
  member,
  user,
}: {
  userMember: { role: Role };
  member: { _id: string; user: { _id: string }; role: Role };
  user: { _id: string };
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const changeMemberRoleMutation = useChangeMemberRoleMutation();
  const deleteWorkspaceMemberMutation = useDeleteWorkspaceMemberMutation();

  const handleChangeRole = async (role: Role) => {
    const result = changeMemberRoleMutation.mutateAsync({
      workspaceId,
      memberId: member._id.toString(),
      role,
    });

    toast.promise(result, {
      loading: CHANGE_MEMBER_ROLE_LOADING_MESSAGE,
      success: () => {
        router.refresh();
        return CHANGE_MEMBER_ROLE_SUCCESS_MESSAGE;
      },
      error: CHANGE_MEMBER_ROLE_ERROR_MESSAGE,
    });
  };

  const handleDeleteWorkspaceMember = async () => {
    const result = deleteWorkspaceMemberMutation.mutateAsync({
      workspaceId,
      memberId: member._id.toString(),
    });

    toast.promise(result, {
      loading:
        userMember.role === ADMIN
          ? REMOVE_WORKSPACE_MEMBER_LOADING_MESSAGE
          : LEAVE_WORKSPACE_LOADING_MESSAGE,
      success: () => {
        router.refresh();

        if (userMember.role !== ADMIN) {
          queryClient.setQueryData<GetUserWorkspacesResponse>(
            ["workspaces"],
            (oldData?: GetUserWorkspacesResponse) => {
              const oldWorkspaces = oldData?.workspaces ?? [];
              const deletedWorkspaceId = workspaceId;
              const workspaces = oldWorkspaces.filter((workspace) => {
                return workspace._id.toString() !== deletedWorkspaceId;
              });

              return { workspaces };
            }
          );

          queryClient.invalidateQueries({ queryKey: ["workspaces"] });

          router.push("/workspaces");
        }

        return userMember.role === ADMIN
          ? REMOVE_WORKSPACE_MEMBER_SUCCESS_MESSAGE
          : LEAVE_WORKSPACE_SUCCESS_MESSAGE;
      },
      error:
        userMember.role === ADMIN
          ? REMOVE_WORKSPACE_MEMBER_ERROR_MESSAGE
          : LEAVE_WORKSPACE_ERROR_MESSAGE,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={
            (userMember.role !== ADMIN &&
              user?._id.toString() !== member.user._id.toString()) ||
            (userMember.role === ADMIN &&
              user?._id.toString() === member.user._id.toString())
          }
        >
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {userMember.role === ADMIN && (
          <>
            <DropdownMenuLabel className="sr-only">
              Role Management
            </DropdownMenuLabel>
            {member.role !== ADMIN && (
              <DropdownMenuItem
                className="font-medium"
                onClick={() => handleChangeRole(ADMIN)}
              >
                <UserCogIcon /> Set as admin
              </DropdownMenuItem>
            )}
            {member.role !== MEMBER && (
              <DropdownMenuItem
                className="font-medium"
                onClick={() => handleChangeRole(MEMBER)}
              >
                <UserIcon /> Set as member
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel className="sr-only">
          Workspace Actions
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="text-red-700 focus:text-red-700 font-medium"
          onClick={handleDeleteWorkspaceMember}
        >
          <LogOutIcon />{" "}
          {userMember.role === ADMIN ? "Remove User" : "Leave Workspace"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
