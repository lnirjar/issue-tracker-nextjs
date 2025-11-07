"use client";

import Link from "next/link";
import { PencilIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { WorkspaceAvatar } from "@/components/workspace-avatar";

import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useUserWorkspacesDataQuery } from "@/hooks/queries/useUserWorkpacesDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const WorkspaceDetails = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading, isError, isPending } = useUserWorkspacesDataQuery(
    {}
  );

  if (isPending || isLoading) {
    return <Skeleton className="h-9 w-full max-w-2xl" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  const workspace = data.workspaces.find(
    (workspace) => workspace._id.toString() === workspaceId
  );

  if (!workspace) {
    return <div>No workspace found</div>;
  }

  return (
    <div className="flex items-center justify-between max-w-2xl">
      <div className="flex items-center gap-4">
        <WorkspaceAvatar
          name={workspace.name}
          image={workspace.image}
          className="size-8"
        />
        <h1 className="text-xl font-semibold truncate">{workspace.name}</h1>
      </div>
      <Button variant="secondary" asChild>
        <Link href={`/workspaces/${workspaceId}/settings`}>
          <PencilIcon /> <span className="">Edit workspace</span>
        </Link>
      </Button>
    </div>
  );
};
