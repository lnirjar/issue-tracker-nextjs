import { Types } from "mongoose";
import { TerminalIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { UpdateWorkspaceFormCard } from "@/components/update-workspace-form-card";
import { ResetWorkspaceInviteFormCard } from "@/components/reset-workspace-invite-form-card";
import { DeleteWorkspaceFormCard } from "@/components/delete-workspace-form-card";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";
import { ADMIN, NOT_WORKSPACE_ADMIN_MESSAGE } from "@/lib/constants";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  await dbConnect();

  const { workspaceId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    notFound();
  }

  if (member.role !== ADMIN) {
    return (
      <Alert className="w-fit">
        <TerminalIcon className="h-5 w-5" />
        <AlertTitle className="text-lg">
          {NOT_WORKSPACE_ADMIN_MESSAGE}
        </AlertTitle>
        <AlertDescription>
          Only workspace admins can modify settings of the workspace
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <UpdateWorkspaceFormCard workspaceId={workspaceId} />
      <ResetWorkspaceInviteFormCard workspaceId={workspaceId} />
      <DeleteWorkspaceFormCard />
    </div>
  );
}
