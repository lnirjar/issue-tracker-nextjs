import { Types } from "mongoose";
import { notFound, redirect } from "next/navigation";

import { Workspace } from "@/models/workspace";
import { WorkspaceInvitation } from "@/models/workspace-invitation";

import { getWorkspaceMember } from "@/lib/workspace";
import { JoinWorkspaceFormCard } from "@/components/join-workspace-form-card";

export default async function JoinWorkspacePage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;

  if (!Types.ObjectId.isValid(inviteId)) {
    notFound();
  }

  const invitation = await WorkspaceInvitation.findById(inviteId)
    .populate<{ workspace: Workspace }>("workspace")
    .exec();

  if (!invitation || !invitation.workspace) {
    notFound();
  }

  const member = await getWorkspaceMember(invitation.workspace._id.toString());

  if (member) {
    redirect(`/workspaces/${invitation.workspace._id.toString()}`);
  }

  return (
    <div className="min-h-full">
      <JoinWorkspaceFormCard workspace={invitation.workspace} />
    </div>
  );
}
