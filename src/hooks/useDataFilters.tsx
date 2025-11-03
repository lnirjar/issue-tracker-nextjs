import { useState } from "react";
import { ALL, TaskStatus } from "@/lib/constants";

export type DataFiltersState = {
  status: TaskStatus | typeof ALL;
  assigneeId: string;
  projectId: string;
  dueDate: Date | undefined;
};

export const useDataFilters = () => {
  const [filters, setFilters] = useState<DataFiltersState>({
    status: ALL,
    assigneeId: ALL,
    projectId: ALL,
    dueDate: undefined,
  });

  return [filters, setFilters] as const;
};
