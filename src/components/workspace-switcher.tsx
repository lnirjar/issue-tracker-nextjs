"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { CreateWorkspaceModal } from "@/components/create-workspace-modal";
import { useUserWorkspacesDataQuery } from "@/hooks/queries/useUserWorkpacesDataQuery";
import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export const WorkspaceSwitcher = () => {
  const router = useRouter();

  const { data, isLoading, isError, isPending } = useUserWorkspacesDataQuery(
    {}
  );

  const workspaceId = useWorkspaceId();

  const onSelect = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <CreateWorkspaceModal>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </CreateWorkspaceModal>
      </div>
      {isPending || isLoading ? (
        <Skeleton className="w-full h-12" />
      ) : isError ? (
        <div>{UNKNOWN_ERROR_MESSAGE}</div>
      ) : data?.workspaces.length === 0 ? (
        <div>No workspaces found</div>
      ) : (
        <Select
          onValueChange={onSelect}
          value={
            data.workspaces.find(
              (workspace) => workspace._id.toString() === workspaceId
            )
              ? workspaceId
              : undefined
          }
        >
          <SelectTrigger className="w-full h-12 bg-neutral-200 font-medium p-1 focus:ring-transparent">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent>
            {data?.workspaces.map((workspace) => (
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
