"use client";

import Link from "next/link";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { ProjectList } from "@/components/project-list";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

export const Sidebar = () => {
  const workspaceId = useWorkspaceId();

  return (
    <aside className="min-h-full bg-neutral-50 p-4 w-full">
      <Link href="/" className="block mt-1.5 mb-5 w-fit">
        <Image
          src="/logo.svg"
          alt="logo"
          width={231}
          height={43}
          priority
          className="w-48 max-w-full"
        />
      </Link>
      <Separator className="my-4" />
      <WorkspaceSwitcher />

      {workspaceId && (
        <>
          <Separator className="my-4" />
          <Navigation />
          <Separator className="my-4" />
          <ProjectList />
        </>
      )}
    </aside>
  );
};
