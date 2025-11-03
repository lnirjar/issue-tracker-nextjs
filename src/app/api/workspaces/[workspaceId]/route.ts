import createHttpError from "http-errors";
import { UploadApiResponse } from "cloudinary";

import { Workspace } from "@/models/workspace";
import { WorkspaceMember } from "@/models/workspace-member";
import { updateWorkspaceFormSchema } from "@/schemas/workspace";
import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import {
  deleteWorkspaceAvatarFromCloudinary,
  uploadWorkspaceAvatarToCloudinary,
} from "@/lib/cloudinary";
import { handleError } from "@/lib/error";
import {
  ADMIN,
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_ADMIN_MESSAGE,
  WORKSPACE_NOT_FOUND_MESSAGE,
} from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { workspaceId } = await params;

    const formData = await request.formData();

    const data = {
      name: formData.get("name"),
      image: formData.get("image") || undefined,
    };

    const parsed = updateWorkspaceFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, image } = parsed.data;

    const member = await getWorkspaceMember(workspaceId, user);

    if (member?.role !== ADMIN) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_ADMIN_MESSAGE);
    }

    let uploadResult: UploadApiResponse | undefined;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadResult = await uploadWorkspaceAvatarToCloudinary(
        buffer,
        workspaceId
      );
    }

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      {
        name,
        image: uploadResult?.secure_url,
      },
      { new: true }
    );

    return Response.json({ workspace: updatedWorkspace }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function DELETE(
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

    // TODO: Delete workspace projects and project avatars
    // TODO: Delete workspace tasks

    const deletedWorkspace = await Workspace.findByIdAndDelete(
      workspaceId
    ).exec();

    if (!deletedWorkspace) {
      throw new createHttpError.Forbidden(WORKSPACE_NOT_FOUND_MESSAGE);
    }

    const deleteWorkspaceMembers = WorkspaceMember.deleteMany({
      workspace: workspaceId,
    }).exec();

    const deleteWorkspaceAvatar =
      deleteWorkspaceAvatarFromCloudinary(workspaceId);

    await Promise.all([deleteWorkspaceMembers, deleteWorkspaceAvatar]);

    return Response.json({ workspace: deletedWorkspace }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
