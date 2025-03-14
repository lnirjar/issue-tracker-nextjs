"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { Sidebar } from "@/components/sidebar";

const navItems = [
  {
    path: "workspaces",
    title: "Workspaces",
    description: "Browse and access all your workspaces in one place.",
  },
  {
    path: "home",
    title: "Home",
    description: "View an overview of your workspaces, projects, and tasks.",
  },
  {
    path: "tasks",
    title: "Tasks",
    description: "Manage and track your tasks across different projects.",
  },
  {
    path: "settings",
    title: "Settings",
    description: "Update workspace settings, preferences, and configurations.",
  },
  {
    path: "members",
    title: "Members",
    description: "View and manage workspace members and permissions.",
  },
];

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameArr = pathname.split("/");
  const path =
    pathnameArr.length === 4
      ? pathnameArr[3]
      : pathnameArr.length === 3
      ? "home"
      : "workspaces";

  const navItem = navItems.find((item) => item.path === path);

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
