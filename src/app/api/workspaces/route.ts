import "@/models";
import { Workspace } from "@/models/workspace";
import { WorkspaceMember } from "@/models/workspace-member";
import { WorkspaceInvitation } from "@/models/workspace-invitation";

import { createWorkspaceFormSchema } from "@/schemas/workspace";
import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getUserWorkspaces } from "@/lib/workspace";
import { uploadWorkspaceAvatarToCloudinary } from "@/lib/cloudinary";
import { handleError } from "@/lib/error";
import {
  ADMIN,
  AUTH_REQUIRED_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from "@/lib/constants";

export async function GET() {
  try {
    const workspaces = await getUserWorkspaces();
    return Response.json({ workspaces }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const formData = await request.formData();

    const data = {
      name: formData.get("name"),
      image: formData.get("image") || undefined,
    };

    const parsed = createWorkspaceFormSchema.safeParse(data);

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

    const workspace = await Workspace.create({ name, user: user._id });

    const workspaceMember = await WorkspaceMember.create({
      workspace: workspace._id,
      user: user._id,
      role: ADMIN,
    });

    const workspaceInvitation = await WorkspaceInvitation.create({
      workspace: workspace._id,
    });

    if (!image) {
      return Response.json({ workspace, workspaceMember }, { status: 201 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadWorkspaceAvatarToCloudinary(
      buffer,
      workspace._id.toString()
    );

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspace._id,
      {
        image: uploadResult.secure_url,
      },
      { new: true }
    );

    return Response.json(
      { workspace: updatedWorkspace, workspaceMember, workspaceInvitation },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: UNKNOWN_ERROR_MESSAGE }, { status: 500 });
  }
}
