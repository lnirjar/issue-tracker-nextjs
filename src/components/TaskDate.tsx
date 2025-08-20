import { DONE, TaskStatus } from "@/lib/constants";
import {
  format,
  differenceInDays,
  isToday,
  isPast,
  isThisYear,
} from "date-fns";

export const TaskDate = ({
  date,
  status,
}: {
  date: string | Date;
  status: TaskStatus;
}) => {
  const today = new Date();
  const endDate = new Date(date);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";
  let formattedDate: string;

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

  return <span className={textColor}>{formattedDate}</span>;
};
