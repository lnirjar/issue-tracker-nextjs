import { Types } from "mongoose";
import createHttpError from "http-errors";

import { WorkspaceMember } from "@/models/workspace-member";
import { changeMemberRoleSchema } from "@/schemas/member";
import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import { handleError } from "@/lib/error";
import {
  ADMIN,
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_ADMIN_MESSAGE,
} from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string; memberId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      throw new createHttpError.Unauthorized(AUTH_REQUIRED_MESSAGE);
    }

    const { workspaceId, memberId } = await params;

    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new createHttpError.BadRequest("Invalid workspace id");
    }

    if (!Types.ObjectId.isValid(memberId)) {
      throw new createHttpError.BadRequest("Invalid member id");
    }

    const data = await request.json();

    const parsed = changeMemberRoleSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { role } = parsed.data;

    const userMember = await getWorkspaceMember(workspaceId, user);

    if (userMember?.role !== ADMIN) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_ADMIN_MESSAGE);
    }

    if (userMember._id.toString() === memberId) {
      throw new createHttpError.Forbidden("You cannot change your own role");
    }

    const updatedMember = await WorkspaceMember.findOneAndUpdate(
      { _id: memberId, workspace: workspaceId, user: { $ne: user._id } },
      { role },
      { new: true }
    );

    if (!updatedMember) {
      throw new createHttpError.NotFound("Member not found");
    }

    return Response.json({ member: updatedMember }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string; memberId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      throw new createHttpError.Unauthorized(AUTH_REQUIRED_MESSAGE);
    }

    const { workspaceId, memberId } = await params;

    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new createHttpError.BadRequest("Invalid workspace id");
    }

    if (!Types.ObjectId.isValid(memberId)) {
      throw new createHttpError.BadRequest("Invalid member id");
    }

    const userMember = await getWorkspaceMember(workspaceId, user);

    if (userMember?._id.toString() === memberId) {
      if (userMember.role === ADMIN) {
        throw new createHttpError.Forbidden(
          "Admin cannot leave the workspace by themselves"
        );
      }

      const deletedMember = await WorkspaceMember.findByIdAndDelete(memberId);
      return Response.json({ member: deletedMember }, { status: 200 });
    }

    if (userMember?.role !== ADMIN) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_ADMIN_MESSAGE);
    }

    const deletedMember = await WorkspaceMember.findOneAndDelete({
      _id: memberId,
      workspace: workspaceId,
      user: { $ne: user._id },
    });

    return Response.json({ member: deletedMember }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
