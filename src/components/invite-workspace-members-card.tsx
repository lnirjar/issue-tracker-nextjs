"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWorkspaceInvitationDataQuery } from "@/hooks/queries/useWorkspaceInvitationDataQuery";

import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const InviteWorkspaceMembersCard = () => {
  const { data, isLoading, isError, isPending } =
    useWorkspaceInvitationDataQuery({});

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (isPending || isLoading) {
    return <Skeleton className="h-48 w-full max-w-2xl" />;
  }

  if (isError) {
    return <div>{UNKNOWN_ERROR_MESSAGE}</div>;
  }

  if (!data.invitation) {
    return (
      <div>
        Workspace Invitation Not Found. Try to reset invitaion from settings.
      </div>
    );
  }

  const fullInviteLink = `${baseUrl}/invite/${data.invitation._id.toString()}`;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Share this link to invite others to your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input readOnly value={fullInviteLink} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(fullInviteLink);
              toast.success("Copied!");
            }}
          >
            <CopyIcon />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Anyone with this link can join your workspace.
        </p>
      </CardFooter>
    </Card>
  );
};
