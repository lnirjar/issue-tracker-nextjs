import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
  addYears,
} from "date-fns";
import { enUS } from "date-fns/locale";

import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";
import { EventCard } from "@/components/tasks-event-card";
import { CalendarToolbar } from "@/components/tasks-calendar-custom-toolbar";

import { PREV, NEXT, TODAY, CalendarNavigationAction } from "@/lib/constants";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./tasks-data-calendar.css";

interface DataCaledarProps {
  data: GetTasksResponse;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const DataCalendar = ({ data }: DataCaledarProps) => {
  const [value, setValue] = useState(new Date());

  const events = data.tasks.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    task,
  }));

  const handleNavigate = (action: CalendarNavigationAction) => {
    if (action === PREV) {
      setValue((prev) => subMonths(prev, 1));
    } else if (action === NEXT) {
      setValue((prev) => addMonths(prev, 1));
    } else if (action === TODAY) {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={addYears(new Date(), 1)}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => <EventCard task={event.task} />,
        toolbar: () => (
          <CalendarToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
};
