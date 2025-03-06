"use client";

import { RiAddCircleFill } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { useUserWorkspacesDataQuery } from "@/hooks/queries/useUserWorkpacesDataQuery";
import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const WorkspaceSwitcher = () => {
  const { data, isLoading, isError } = useUserWorkspacesDataQuery();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>{UNKNOWN_ERROR_MESSAGE}</div>
      ) : data?.data.workspaces.length === 0 ? (
        <div>No workspaces found</div>
      ) : (
        <Select>
          <SelectTrigger className="w-full h-fit bg-neutral-200 font-medium p-1 focus:ring-transparent">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent>
            {data?.data.workspaces.map((workspace) => (
              <SelectItem
                key={workspace._id.toString()}
                value={workspace._id.toString()}
              >
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.image}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
