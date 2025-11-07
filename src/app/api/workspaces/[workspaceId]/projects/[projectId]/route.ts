import { Types } from "mongoose";
import { UploadApiResponse } from "cloudinary";
import createHttpError from "http-errors";

import { WorkspaceProject } from "@/models/project";
import { Task } from "@/models/task";
import { updateProjectFormSchema } from "@/schemas/project";
import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import {
  deleteWorkspaceProjectAvatarFromCloudinary,
  uploadWorkspaceProjectAvatarToCloudinary,
} from "@/lib/cloudinary";
import { handleError } from "@/lib/error";
import {
  AUTH_REQUIRED_MESSAGE,
  DELETE_PROJECT_ERROR_MESSAGE,
  NOT_WORKSPACE_MEMBER_MESSAGE,
  PROJECT_NOT_FOUND_MESSAGE,
} from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
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

    const parsed = updateProjectFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { projectId } = await params;

    if (!Types.ObjectId.isValid(projectId)) {
      throw new createHttpError.BadRequest("Invalid project id");
    }

    const { name, image } = parsed.data;

    const project = await WorkspaceProject.findById(projectId);

    if (!project) {
      throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
    }

    const workspaceId = project.workspace.toString();

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    let uploadResult: UploadApiResponse | undefined;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadResult = await uploadWorkspaceProjectAvatarToCloudinary(
        buffer,
        project._id.toString()
      );
    }

    const updatedProject = await WorkspaceProject.findByIdAndUpdate(
      project._id,
      {
        name,
        image: uploadResult?.secure_url,
      },
      { new: true }
    );

    return Response.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await WorkspaceProject.findById(projectId);

    if (!project) {
      throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
    }

    const workspaceId = project.workspace.toString();

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const deleteTasks = Task.deleteMany({ project: project._id }).exec();

    const deleteProject = WorkspaceProject.findByIdAndDelete(projectId).exec();

    const deleteProjectAvatar = deleteWorkspaceProjectAvatarFromCloudinary(
      projectId
    ).catch(() => {
      console.error(`Failed to delete avatar for project id ${projectId}`);
    });

    const results = await Promise.allSettled([
      deleteProject,
      deleteTasks,
      deleteProjectAvatar,
    ]);

    const deletedProject =
      results[0].status === "fulfilled" ? results[0].value : null;

    const failedDeletions = results.filter(
      (result) => result.status === "rejected"
    );
    if (failedDeletions.length > 0) {
      console.error(
        `${failedDeletions.length} deletions failed during project deletion`
      );
    }

    if (!deletedProject) {
      throw new createHttpError.InternalServerError(
        DELETE_PROJECT_ERROR_MESSAGE
      );
    }

    return Response.json({ project: deletedProject }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
