import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { WorkspaceMemberActionsDropdown } from "@/components/workspace-member-actions-dropdown";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember, getWorkspaceMembers } from "@/lib/workspace";
import { getCurrentUser } from "@/lib/user";
import { ADMIN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Members",
};

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  await dbConnect();

  const { workspaceId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  const user = await getCurrentUser();

  const userMember = await getWorkspaceMember(workspaceId, user);

  if (!userMember) {
    notFound();
  }

  const members = await getWorkspaceMembers(workspaceId, user);

  return (
    <div className="flex flex-col">
      {members.map((member, i) => {
        return (
          <div key={member._id.toString()} className="max-w-sm">
            {i !== 0 && <Separator className="my-4" />}
            <div className="flex gap-6 items-center">
              <div>
                <Avatar>
                  {member.user.avatar && (
                    <AvatarImage src={member.user.avatar} />
                  )}
                  <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-6">
                  <div className="font-semibold">{member.user.name}</div>
                  <Badge
                    variant={member.role === ADMIN ? "default" : "outline"}
                  >
                    {member.role}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  @{member.user.username}
                </div>
              </div>
              <div>
                <WorkspaceMemberActionsDropdown
                  userMember={{ role: userMember.role }}
                  member={{
                    _id: member._id.toString(),
                    user: { _id: member.user._id.toString() },
                    role: member.role,
                  }}
                  user={{ _id: user?._id.toString() ?? "" }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
