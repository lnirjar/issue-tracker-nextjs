import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CalendarNavigationAction, NEXT, PREV, TODAY } from "@/lib/constants";

interface CalendarToolbarProps {
  date: Date;
  onNavigate: (action: CalendarNavigationAction) => void;
}

export const CalendarToolbar = ({ date, onNavigate }: CalendarToolbarProps) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button onClick={() => onNavigate(PREV)} variant="secondary" size="icon">
        <ChevronLeftIcon className="size-4" />
      </Button>

      <Button onClick={() => onNavigate(TODAY)} variant="secondary">
        <CalendarIcon className="size-4" /> {format(date, "MMMM yyyy")}
      </Button>

      <Button onClick={() => onNavigate(NEXT)} variant="secondary" size="icon">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
