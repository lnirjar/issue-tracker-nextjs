import { format } from "date-fns";

import { Workspace } from "@/models/workspace";

import { JoinWorkspaceForm } from "@/components/join-workspace-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const JoinWorkspaceFormCard = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>{workspace.name}</CardTitle>
        <CardDescription>
          Created on {format(new Date(workspace.createdAt), "do MMMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar className="size-56 rounded-md">
          <AvatarImage src={workspace.image ?? undefined} />
          <AvatarFallback className="rounded-md text-4xl">
            {workspace.name[0]}
          </AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter>
        <JoinWorkspaceForm />
      </CardFooter>
    </Card>
  );
};
