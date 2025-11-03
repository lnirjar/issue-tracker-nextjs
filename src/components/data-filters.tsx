import { Dispatch, SetStateAction, useEffect } from "react";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/date-picker";

import { WorkspaceAvatar } from "@/components/workspace-avatar";

import { useWorkspaceMembersDataQuery } from "@/hooks/queries/useWorkspaceMembersDataQuery";
import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { DataFiltersState } from "@/hooks/useDataFilters";

import { cn } from "@/lib/utils";
import {
  TASK_STATUSES,
  TaskStatus,
  ALL,
  KANBAN,
  CALENDAR,
} from "@/lib/constants";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  view?: string;
  filters: DataFiltersState;
  setFilters: Dispatch<SetStateAction<DataFiltersState>>;
}

export const DataFilters = ({
  hideProjectFilter,
  view,
  filters,
  setFilters,
}: DataFiltersProps) => {
  const membersQuery = useWorkspaceMembersDataQuery({});
  const projectsQuery = useWorkspaceProjectsDataQuery({});

  useEffect(() => {
    if (view === KANBAN) {
      setFilters((prev) => ({ ...prev, status: ALL }));
    } else if (view === CALENDAR) {
      setFilters((prev) => ({ ...prev, dueDate: undefined }));
    }
  }, [view, setFilters]);

  const onStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as TaskStatus | typeof ALL,
    }));
  };

  const onAssigneeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, assigneeId: value }));
  };

  const onProjectChange = (value: string) => {
    setFilters((prev) => ({ ...prev, projectId: value }));
  };

  const onDateChange = (value: Date) => {
    setFilters((prev) => ({ ...prev, dueDate: value }));
  };

  const isLoading =
    membersQuery.isPending ||
    membersQuery.isLoading ||
    projectsQuery.isPending ||
    projectsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-4">
        <Skeleton className="h-8 w-full sm:w-36" />
        <Skeleton className="h-8 w-full sm:w-36" />
        <Skeleton className="h-8 w-full sm:w-36" />
        {!hideProjectFilter && <Skeleton className="h-8 w-full sm:w-36" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-4">
      {view !== KANBAN && (
        <Select
          value={filters.status}
          onValueChange={onStatusChange}
          defaultValue={ALL}
        >
          <SelectTrigger className="w-full sm:w-auto h-8 [&>span]:w-full [&>span]:text-left">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue
              placeholder="All statuses"
              className="w-full text-left"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectSeparator />
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.assigneeId}
        onValueChange={onAssigneeChange}
        defaultValue={ALL}
      >
        <SelectTrigger
          className={cn(
            "pl-0 w-full sm:w-auto h-8",
            filters.assigneeId !== ALL ? "" : "pl-3"
          )}
        >
          <SelectValue placeholder="All assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            <div className="flex gap-2 items-center">
              <UserIcon className="size-4" />
              <span>All assignee</span>
            </div>
          </SelectItem>
          <SelectSeparator />
          {membersQuery.data?.members.map((member) => (
            <SelectItem
              key={member._id.toString()}
              value={member.user._id.toString()}
              className="pl-0"
            >
              <div className="flex gap-2 items-center">
                <WorkspaceAvatar
                  name={member.user.name}
                  image={member.user.avatar}
                  className="size-7"
                />
                <span className="truncate">{member.user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          value={filters.projectId}
          onValueChange={onProjectChange}
          defaultValue={ALL}
        >
          <SelectTrigger
            className={cn(
              "pl-0 w-full sm:w-auto h-8",
              filters.projectId !== ALL ? "" : "pl-3"
            )}
          >
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>
              <div className="flex gap-2 items-center">
                <FolderIcon className="size-4" />
                <span className="truncate">All projects</span>
              </div>
            </SelectItem>
            <SelectSeparator />
            {projectsQuery.data?.projects.map((project) => (
              <SelectItem
                key={project._id.toString()}
                value={project._id.toString()}
                className="pl-0"
              >
                <div className="flex gap-2 items-center">
                  <WorkspaceAvatar
                    name={project.name}
                    image={project.image}
                    className="size-7"
                  />
                  <span className="truncate">{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {view !== CALENDAR && (
        <DatePicker
          value={filters.dueDate}
          onChange={onDateChange}
          placeholder="Due date"
          className="w-full sm:w-auto h-8"
        />
      )}
    </div>
  );
};
