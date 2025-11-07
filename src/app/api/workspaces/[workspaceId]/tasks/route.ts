import { RootFilterQuery, Types } from "mongoose";
import createHttpError from "http-errors";
import { NextRequest } from "next/server";

import "@/models";
import { WorkspaceProject } from "@/models/project";
import { Task } from "@/models/task";
import { User } from "@/models/user";

import { getTasksQuerySchema } from "@/schemas/task";
import { createTaskFormSchema } from "@/schemas/task";

import { dbConnect } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getWorkspaceMember } from "@/lib/workspace";
import { handleError } from "@/lib/error";
import {
  ASSIGNEE_NOT_WORKSPACE_MEMBER_MESSAGE,
  AUTH_REQUIRED_MESSAGE,
  NOT_WORKSPACE_MEMBER_MESSAGE,
  PROJECT_NOT_FOUND_MESSAGE,
} from "@/lib/constants";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ workspaceId: string }>;
  }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const { workspaceId } = await params;

    if (!Types.ObjectId.isValid(workspaceId)) {
      throw new createHttpError.BadRequest("Invalid workspace id");
    }

    const searchParams = request.nextUrl.searchParams;

    const query = Object.fromEntries(searchParams.entries());

    const parsed = getTasksQuerySchema.safeParse(query);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const { projectId, assigneeId, status, dueDate, search } = parsed.data;

    const filter: RootFilterQuery<Task> = {};

    if (projectId) {
      const project = await WorkspaceProject.findOne({
        _id: projectId,
        workspace: workspaceId,
      })
        .select("_id")
        .exec();

      if (!project) {
        throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
      }

      filter.project = projectId;
    } else {
      const projects = await WorkspaceProject.find({
        workspace: workspaceId,
      })
        .select("_id")
        .exec();

      if (projects.length === 0) {
        return Response.json({ tasks: [] }, { status: 200 });
      }

      const projectIds = projects.map((project) => project._id.toString());

      filter.project = { $in: projectIds };
    }

    if (assigneeId) {
      filter.assignee = assigneeId;
    }

    if (status) {
      filter.status = status;
    }

    if (dueDate) {
      const date = new Date(dueDate);
      const start = new Date(date.setUTCHours(0, 0, 0, 0));
      const end = new Date(date.setUTCHours(23, 59, 59, 999));
      filter.dueDate = { $gte: start, $lte: end };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate<{ project: WorkspaceProject }>("project")
      .populate<{ assignee: User }>("assignee")
      .exec();

    return Response.json({ tasks }, { status: 200 });
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

    const data = await request.json();

    const parsed = createTaskFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, description, status, projectId, assigneeId, dueDate } =
      parsed.data;

    const project = await WorkspaceProject.findById(projectId);

    if (!project) {
      throw new createHttpError.NotFound(PROJECT_NOT_FOUND_MESSAGE);
    }

    const workspaceId = project.workspace.toString();

    const member = await getWorkspaceMember(workspaceId, user);

    if (!member) {
      throw new createHttpError.Forbidden(NOT_WORKSPACE_MEMBER_MESSAGE);
    }

    const assignee = await getWorkspaceMember(workspaceId, { _id: assigneeId });

    if (!assignee) {
      throw new createHttpError.Forbidden(
        ASSIGNEE_NOT_WORKSPACE_MEMBER_MESSAGE
      );
    }

    const highestPositionTasks = await Task.find({
      project: projectId,
      status,
    })
      .sort({ position: -1 })
      .limit(1)
      .exec();

    const newHighestPosition =
      highestPositionTasks.length > 0
        ? highestPositionTasks[0].position + 1000
        : 1000;

    const newTask = await Task.create({
      name,
      description,
      status,
      dueDate,
      assignee: assignee.user._id,
      project: project._id,
      position: newHighestPosition,
    });

    const task = await Task.findById(newTask._id)
      .populate<{ project: WorkspaceProject }>("project")
      .populate<{ assignee: User }>("assignee")
      .exec();

    return Response.json({ task }, { status: 201 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
