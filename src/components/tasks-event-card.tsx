import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TaskActions } from "@/components/task-actions";
import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";

import { cn } from "@/lib/utils";
import {
  BACKLOG,
  DONE,
  IN_PROGRESS,
  IN_REVIEW,
  TODO,
  TaskStatus,
} from "@/lib/constants";

interface EventCardProps {
  task: GetTasksResponse["tasks"][number];
}

const statusColorMap: Record<TaskStatus, string> = {
  [BACKLOG]: "border-l-pink-400",
  [TODO]: "border-l-red-400",
  [IN_PROGRESS]: "border-l-yellow-400",
  [IN_REVIEW]: "border-l-blue-400",
  [DONE]: "border-l-emerald-400",
};

export const EventCard = ({ task }: EventCardProps) => {
  return (
    <TaskActions task={task}>
      <div className="px-2">
        <div
          className={cn(
            "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
            statusColorMap[task?.status]
          )}
        >
          <p className="line-clamp-2">{task.name}</p>
          <div className="flex items-center gap-x-1">
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
            <div className="size-1 rounded-full bg-neutral-300" />
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
          </div>
        </div>
      </div>
    </TaskActions>
  );
};
