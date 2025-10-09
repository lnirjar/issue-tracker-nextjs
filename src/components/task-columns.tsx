"use client";

import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";

import { Button } from "@/components/ui/button";
import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { TaskDate } from "@/components/TaskDate";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { TaskActions } from "@/components/task-actions";

export const columns: ColumnDef<GetTasksResponse["tasks"][number]>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="line-clamp-1">{name}</span>;
    },
  },
  {
    accessorKey: "project",
    accessorFn: (row) => row.project.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex gap-2 items-center">
          <WorkspaceAvatar
            name={project.name}
            image={project.image}
            className="size-6"
          />
          <span className="line-clamp-1">{project.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    accessorFn: (row) => row.assignee.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex gap-2 items-center">
          <WorkspaceAvatar
            name={assignee.name}
            image={assignee.avatar}
            className="size-6"
          />
          <span className="line-clamp-1">{assignee.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.dueDate;
      const status = row.original.status;
      return <TaskDate date={date} status={status} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <TaskStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TaskActions task={row.original}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
