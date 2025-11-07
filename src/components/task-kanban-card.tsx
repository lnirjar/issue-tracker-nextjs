import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TaskActions } from "@/components/task-actions";
import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { TaskDate } from "@/components/TaskDate";

import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";

interface TaskKanbanCardProps {
  task: GetTasksResponse["tasks"][number];
}

export const TaskKanbanCard = ({ task }: TaskKanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-4">{task.name}</p>
        <TaskActions task={task}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <WorkspaceAvatar
                name={task.project.name}
                image={task.project.image}
                className="size-6"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Project: {task.project.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <WorkspaceAvatar
                name={task.assignee.name}
                image={task.assignee.avatar}
                className="size-6 rounded-full"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Assignee: {task.assignee.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TaskDate
          date={task.dueDate}
          status={task.status}
          className="text-xs"
        />
      </div>
    </div>
  );
};
