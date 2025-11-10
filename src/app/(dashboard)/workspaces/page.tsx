import Link from "next/link";
import { Metadata } from "next";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateWorkspaceFormCard } from "@/components/create-workspace-form-card";

import { getUserWorkspaces } from "@/lib/workspace";
import { dbConnect } from "@/lib/db";

export const metadata: Metadata = {
  title: "Workspaces",
};

export default async function WorkspacesPage() {
  await dbConnect();

  const workspaces = await getUserWorkspaces();

  if (workspaces.length === 0) {
    return <CreateWorkspaceFormCard />;
  }

  return (
    <div className="flex flex-col gap-6">
      {workspaces.map((workspace) => (
        <Link
          key={workspace._id.toString()}
          href={`/workspaces/${workspace._id.toString()}`}
        >
          <div className="flex gap-4">
            <Avatar className="size-11 rounded-md">
              <AvatarImage
                src={workspace.image ?? undefined}
                alt={workspace.name}
              />
              <AvatarFallback className="text-primary-foreground bg-primary font-semibold text-lg uppercase rounded-md">
                {workspace.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{workspace.name}</h3>
              <p className="text-muted-foreground">
                Joined on {format(new Date(workspace.joinedAt), "do MMMM yyyy")}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
