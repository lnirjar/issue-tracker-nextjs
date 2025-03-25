"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Sidebar } from "@/components/sidebar";

export const Navbar = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const navItems = [
    {
      path: `/workspaces`,
      title: "Workspaces",
      description: "Browse and access all your workspaces in one place.",
    },
    {
      path: `/workspaces/${workspaceId}`,
      title: "Home",
      description: "View an overview of your workspaces, projects, and tasks.",
    },
    {
      path: `/workspaces/${workspaceId}/tasks`,
      title: "Tasks",
      description: "Manage and track your tasks across different projects.",
    },
    {
      path: `/workspaces/${workspaceId}/settings`,
      title: "Settings",
      description:
        "Update workspace settings, preferences, and configurations.",
    },
    {
      path: `/workspaces/${workspaceId}/members`,
      title: "Members",
      description: "View and manage workspace members and permissions.",
    },
  ];

  const navItem = navItems.find((item) => item.path === pathname);

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{navItem?.title}</h1>
        <p className="text-muted-foreground">{navItem?.description}</p>
      </div>
      <MobileSidebar>
        <Sidebar />
      </MobileSidebar>
      <UserButton />
    </nav>
  );
};
