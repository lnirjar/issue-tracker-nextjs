import { Types } from "mongoose";
import createHttpError from "http-errors";

import { WorkspaceProject } from "@/models/project";
import { createProjectFormSchema } from "@/schemas/project";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember, getWorkspaceProjects } from "@/lib/workspace";
import { uploadWorkspaceProjectAvatarToCloudinary } from "@/lib/cloudinary";
import { handleError } from "@/lib/error";
import {
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_MEMBER_MESSAGE,
} from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const projects = await getWorkspaceProjects(workspaceId);
    return Response.json({ projects }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const formData = await request.formData();

    const data = {
      name: formData.get("name"),
      image: formData.get("image") || undefined,
    };

    const parsed = createProjectFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { workspaceId } = await params;

    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new createHttpError.BadRequest("Invalid workspace id");
    }

    const { name, image } = parsed.data;

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const project = await WorkspaceProject.create({
      name,
      workspace: workspaceId,
    });

    if (!image) {
      return Response.json({ project }, { status: 201 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadWorkspaceProjectAvatarToCloudinary(
      buffer,
      project._id.toString()
    );

    const updatedProject = await WorkspaceProject.findByIdAndUpdate(
      project._id,
      {
        image: uploadResult.secure_url,
      },
      { new: true }
    );

    return Response.json({ project: updatedProject }, { status: 201 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
