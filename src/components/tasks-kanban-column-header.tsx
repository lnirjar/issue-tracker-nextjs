import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateTaskModal } from "@/components/create-task-modal";

import {
  BACKLOG,
  DONE,
  IN_PROGRESS,
  IN_REVIEW,
  TaskStatus,
  TODO,
} from "@/lib/constants";
import { snakeCaseToTitleCase } from "@/lib/utils";

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [BACKLOG]: <CircleDashedIcon className="size-[18px] text-pink-400" />,
  [TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [IN_REVIEW]: <CircleDotIcon className="size-[18px] text-blue-400" />,
  [DONE]: <CircleCheckIcon className="size-[18px] text-emerald-400" />,
};

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <CreateTaskModal status={board}>
        <Button variant="ghost" size="icon">
          <PlusIcon className="size-4 text-neutral-500" />
        </Button>
      </CreateTaskModal>
    </div>
  );
};
