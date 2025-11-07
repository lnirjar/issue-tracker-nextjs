"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { Skeleton } from "@/components/ui/skeleton";

import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

import { WorkspaceAvatar } from "@/components/workspace-avatar";
import { CreateProjectModal } from "@/components/create-project-modal";

import { cn } from "@/lib/utils";
import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const ProjectList = () => {
  const pathname = usePathname();

  const { data, isLoading, isError, isPending } = useWorkspaceProjectsDataQuery(
    {}
  );

  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <CreateProjectModal>
          <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </CreateProjectModal>
      </div>
      {isPending || isLoading ? (
        <Skeleton className="w-full h-12" />
      ) : isError ? (
        <div>{UNKNOWN_ERROR_MESSAGE}</div>
      ) : data?.projects.length === 0 ? (
        <div>No projects found</div>
      ) : (
        <ul className="flex flex-col">
          {data?.projects.map((project) => {
            const href = `/workspaces/${workspaceId}/projects/${project._id.toString()}`;
            const isActive = pathname === href;

            return (
              <Link key={project._id.toString()} href={href}>
                <div
                  className={cn(
                    "w-full flex items-center gap-2.5 p-2.5 rounded-md font-medium text-neutral-500 hover:text-primary transition",
                    isActive &&
                      "bg-white shadow-sm hover:opacity-100 text-primary"
                  )}
                >
                  <WorkspaceAvatar
                    name={project.name}
                    image={project.image}
                    className="size-8"
                  />
                  <span className="truncate">{project.name}</span>
                </div>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
};
