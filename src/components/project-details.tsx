"use client";

import { PencilIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { UpdateProjectModal } from "@/components/update-project-modal";

import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";
import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const ProjectDetails = () => {
  const projectId = useProjectId();

  const { data, isLoading, isError, isPending } = useWorkspaceProjectsDataQuery(
    {}
  );

  const project = data?.projects.find(
    (project) => project._id.toString() === projectId
  );

  if (isPending || isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div className="flex items-center justify-between max-w-2xl">
      <div className="flex items-center gap-4">
        <WorkspaceAvatar
          name={project.name}
          image={project.image}
          className="size-8"
        />
        <h1 className="text-xl font-semibold truncate">{project.name}</h1>
      </div>
      <UpdateProjectModal>
        <Button variant="secondary">
          <PencilIcon /> <span className="">Edit Project</span>
        </Button>
      </UpdateProjectModal>
    </div>
  );
};
