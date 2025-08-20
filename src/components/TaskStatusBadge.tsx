import { Badge } from "@/components/ui/badge";

import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import {
  BACKLOG,
  DONE,
  IN_PROGRESS,
  IN_REVIEW,
  TaskStatus,
  TODO,
} from "@/lib/constants";

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  return (
    <Badge
      className={cn(
        "shadow-none text-primary",
        status === TODO
          ? "bg-red-400 hover:bg-red-400/80"
          : status === IN_PROGRESS
          ? "bg-yellow-400 hover:bg-yellow-400/80"
          : status === IN_REVIEW
          ? "bg-blue-400 hover:bg-blue-400/80"
          : status === DONE
          ? "bg-emerald-400 hover:bg-emerald-400/80"
          : status === BACKLOG
          ? "bg-pink-400 hover:bg-pink-400/80"
          : ""
      )}
    >
      {snakeCaseToTitleCase(status)}
    </Badge>
  );
};
