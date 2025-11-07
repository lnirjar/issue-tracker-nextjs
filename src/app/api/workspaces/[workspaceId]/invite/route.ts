import createHttpError from "http-errors";

import "@/models";
import { WorkspaceInvitation } from "@/models/workspace-invitation";

import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import { handleError } from "@/lib/error";
import {
  ADMIN,
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_ADMIN_MESSAGE,
  NOT_WORKSPACE_MEMBER_MESSAGE,
} from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { workspaceId } = await params;

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const invitation = await WorkspaceInvitation.findOne({
      workspace: workspaceId,
    }).exec();

    return Response.json({ invitation }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { workspaceId } = await params;

    const member = await getWorkspaceMember(workspaceId, user);

    if (member?.role !== ADMIN) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_ADMIN_MESSAGE);
    }

    await WorkspaceInvitation.deleteOne({ workspace: workspaceId }).exec();

    const invitation = await WorkspaceInvitation.create({
      workspace: workspaceId,
    });

    return Response.json({ invitation }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
