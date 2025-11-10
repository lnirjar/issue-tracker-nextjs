import { Types } from "mongoose";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

import "@/models";
import { Workspace } from "@/models/workspace";
import { WorkspaceInvitation } from "@/models/workspace-invitation";

import { JoinWorkspaceFormCard } from "@/components/join-workspace-form-card";

import { getWorkspaceMember } from "@/lib/workspace";
import { dbConnect } from "@/lib/db";

export const metadata: Metadata = {
  title: "Invite",
};

export default async function JoinWorkspacePage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;

  if (!Types.ObjectId.isValid(inviteId)) {
    notFound();
  }

  await dbConnect();

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
