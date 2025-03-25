import "server-only";

import mongoose from "mongoose";
import createHttpError from "http-errors";

import { User } from "@/models/user";
import { Workspace } from "@/models/workspace";
import { WorkspaceMember } from "@/models/workspace-member";
import { getCurrentUser } from "@/lib/user";
import {
  AUTH_REQUIRED_MESSAGE,
  INVALID_WORKSPACE_ID_MESSAGE,
  WORKSPACE_ID_REQUIRED_MESSAGE,
  WORKSPACE_NOT_FOUND_MESSAGE,
} from "@/lib/constants";

export const getUserWorkspaces = async (currentUser?: User) => {
  const user = currentUser ?? (await getCurrentUser());

  if (!user) {
    throw new createHttpError.Unauthorized(AUTH_REQUIRED_MESSAGE);
  }

  const userWorkspaces = await WorkspaceMember.find({
    user: user._id,
  })
    .select("-_id -user")
    .populate<{ workspace: Workspace }>("workspace")
    .exec();

  const workspaces = userWorkspaces.map((workspaceMember) => {
    const workspaceMemberObj = workspaceMember.toObject();
    const { workspace, role, createdAt } = workspaceMemberObj;
    return { ...workspace, role, joinedAt: createdAt };
  });

  return workspaces;
};

export const getUserWorkspace = async (
  workspaceId: string,
  currentUser?: User
) => {
  const user = currentUser ?? (await getCurrentUser());

  if (!user) {
    throw new createHttpError.Unauthorized(AUTH_REQUIRED_MESSAGE);
  }

  const userWorkspace = await WorkspaceMember.findOne({
    user: user._id,
    workspace: workspaceId,
  })
    .select("-_id -user")
    .populate<{ workspace: Workspace }>("workspace")
    .exec();

  if (!userWorkspace) {
    throw new createHttpError.NotFound(WORKSPACE_NOT_FOUND_MESSAGE);
  }

  const workspaceMemberObj = userWorkspace.toObject();
  const { workspace, role } = workspaceMemberObj;
  return { ...workspace, role };
};

export const getWorkspaceMember = async (
  workspaceId: string,
  currentUser?: User
) => {
  if (!workspaceId) {
    throw new createHttpError.BadRequest(WORKSPACE_ID_REQUIRED_MESSAGE);
  }

  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new createHttpError.BadRequest(INVALID_WORKSPACE_ID_MESSAGE);
  }

  const user = currentUser ?? (await getCurrentUser());

  if (!user) {
    throw new createHttpError.Unauthorized(AUTH_REQUIRED_MESSAGE);
  }

  const member = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: user._id.toString(),
  }).exec();

  return member;
};
