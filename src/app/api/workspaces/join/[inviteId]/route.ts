import { Types } from "mongoose";
import createHttpError from "http-errors";

import { Workspace } from "@/models/workspace";
import { WorkspaceInvitation } from "@/models/workspace-invitation";
import { WorkspaceMember } from "@/models/workspace-member";

import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import { handleError } from "@/lib/error";
import { AUTH_REQUIRED_MESSAGE } from "@/lib/constants";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { inviteId } = await params;

    if (!Types.ObjectId.isValid(inviteId)) {
      throw new createHttpError.BadRequest("Invalid invite id");
    }

    const invitation = await WorkspaceInvitation.findById(inviteId)
      .populate<{ workspace: Workspace }>("workspace")
      .exec();

    if (!invitation || !invitation.workspace) {
      throw new createHttpError.NotFound("Invitation not found");
    }

    const member = await getWorkspaceMember(
      invitation.workspace._id.toString(),
      user
    );

    if (member) {
      throw new createHttpError.Conflict(
        "You are already a member of this workspace"
      );
    }

    const workspaceMember = await WorkspaceMember.create({
      workspace: invitation.workspace._id,
      user: user._id,
    });

    return Response.json(
      { workspace: invitation.workspace, workspaceMember },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
