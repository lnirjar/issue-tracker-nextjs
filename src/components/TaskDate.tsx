import {
  format,
  differenceInDays,
  isToday,
  isPast,
  isThisYear,
  formatDistanceToNow,
  endOfDay,
} from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { DONE, TaskStatus } from "@/lib/constants";

export const TaskDate = ({
  date,
  status,
  className,
  showFullDate = false,
}: {
  date: string | Date;
  status: TaskStatus;
  className?: string;
  showFullDate?: boolean;
}) => {
  const today = new Date();
  const endDate = new Date(date);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  let formattedDate: string;
  const formattedTootipDate = showFullDate
    ? formatDistanceToNow(endOfDay(endDate), { addSuffix: true })
    : format(endDate, "MMMM d, yyyy");

  if (isToday(endDate)) {
    formattedDate = "Today";
    textColor = "text-yellow-500";
  } else if (isPast(endDate) && status !== DONE) {
    formattedDate = "Overdue";
    textColor = "text-red-500";
  } else if (diffInDays < 6 && !isPast(endDate)) {
    formattedDate = format(endDate, "EEEE");
    textColor = "text-yellow-500";
  } else if (isThisYear(endDate)) {
    formattedDate = format(endDate, "MMMM d");
  } else {
    formattedDate = format(endDate, "MMMM d, yyyy");
  }

  if (status === DONE) {
    textColor = "text-muted-foreground";
  }

  if (showFullDate) {
    formattedDate = format(endDate, "EEEE, MMMM d, yyyy");
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={cn(textColor, className)}>{formattedDate}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{formattedTootipDate}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
