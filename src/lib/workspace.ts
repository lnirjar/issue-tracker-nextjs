import "server-only";

import createHttpError from "http-errors";

import { Workspace } from "@/models/workspace";
import { WorkspaceMember } from "@/models/workspace-member";
import { getCurrentUser } from "@/lib/user";
import { AUTH_REQUIRED_MESSAGE } from "@/lib/constants";

export const getUserWorkspaces = async () => {
  const user = await getCurrentUser();

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
    const { workspace, role } = workspaceMemberObj;
    return { ...workspace, role };
  });

  return workspaces;
};
