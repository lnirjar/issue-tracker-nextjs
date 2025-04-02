"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Tasks",
    href: "tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  if (!pathname.startsWith(`/workspaces/${workspaceId}`)) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const href =
          item.href === ""
            ? `/workspaces/${workspaceId}`
            : `/workspaces/${workspaceId}/${item.href}`;
        const isActive = pathname === href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium text-neutral-500 hover:text-primary transition",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
