import { Types, UpdateQuery } from "mongoose";
import createHttpError from "http-errors";

import { WorkspaceProject } from "@/models/project";
import { Task } from "@/models/task";
import { User } from "@/models/user";
import { WorkspaceMember } from "@/models/workspace-member";

import { updateTaskFormSchema } from "@/schemas/task";
import { dbConnect } from "@/lib/db";
import { handleError } from "@/lib/error";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";

import {
  ASSIGNEE_NOT_WORKSPACE_MEMBER_MESSAGE,
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_MEMBER_MESSAGE,
  PROJECT_NOT_FOUND_MESSAGE,
  TASK_NOT_FOUND_MESSAGE,
} from "@/lib/constants";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string; taskId: string }>;
  }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { workspaceId, taskId } = await params;

    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new createHttpError.BadRequest("Invalid workspace id");
    }

    if (!Types.ObjectId.isValid(taskId)) {
      throw new createHttpError.BadRequest("Invalid task id");
    }

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const task = await Task.findById(taskId)
      .populate<{ project: WorkspaceProject }>("project")
      .populate<{ assignee: User }>("assignee")
      .exec();

    return Response.json({ task }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { taskId } = await params;

    if (!Types.ObjectId.isValid(taskId)) {
      throw new createHttpError.BadRequest("Invalid task id");
    }

    const data = await request.json();

    const parsed = updateTaskFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new createHttpError.NotFound(TASK_NOT_FOUND_MESSAGE);
    }

    const oldProject = await WorkspaceProject.findById(task.project);

    if (!oldProject) {
      throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
    }

    const workspaceId = oldProject.workspace.toString();

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const { name, description, status, projectId, assigneeId, dueDate } =
      parsed.data;

    let project: WorkspaceProject | null = null;
    if (projectId && projectId !== oldProject._id.toString()) {
      project = await WorkspaceProject.findOne({
        _id: projectId,
        workspace: workspaceId,
      });

      if (!project) {
        throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
      }
    }

    let assignee: WorkspaceMember | null = null;
    if (assigneeId && assigneeId !== task.assignee.toString()) {
      assignee = await getWorkspaceMember(workspaceId, { _id: assigneeId });

      if (!assignee) {
        throw new createHttpError.Forbidden(
          ASSIGNEE_NOT_WORKSPACE_MEMBER_MESSAGE
        );
      }
    }

    const payload: UpdateQuery<Task> = {};
    if (name) payload.name = name;
    if (status) payload.status = status;
    if (dueDate) payload.dueDate = dueDate;
    if (assignee) payload.assignee = assignee.user._id;
    if (project) payload.project = project._id;
    if (description !== undefined && description !== null)
      payload.description = description;

    const updatedTask = await Task.findByIdAndUpdate(task._id, payload, {
      new: true,
    })
      .populate<{ project: WorkspaceProject }>("project")
      .populate<{ assignee: User }>("assignee")
      .exec();

    return Response.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { taskId } = await params;

    if (!Types.ObjectId.isValid(taskId)) {
      throw new createHttpError.BadRequest("Invalid task id");
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new createHttpError.NotFound(TASK_NOT_FOUND_MESSAGE);
    }

    const project = await WorkspaceProject.findById(task.project);

    if (!project) {
      throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
    }

    const member = await getWorkspaceMember(project.workspace.toString(), user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const deletedTask = await Task.findByIdAndDelete(taskId)
      .populate<{ project: WorkspaceProject }>("project")
      .populate<{ assignee: User }>("assignee")
      .exec();

    return Response.json({ task: deletedTask }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
