import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetWorkspaceInviteForm } from "@/components/reset-workspace-invite-form";
import { getWorkspaceInvite } from "@/lib/workspace";

export const ResetWorkspaceInviteFormCard = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const invitation = await getWorkspaceInvite(workspaceId);
  const initialValues = {
    inviteId: invitation?._id.toString() ?? "",
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Workspace Invite</CardTitle>
        <CardDescription>Reset your workspace invite</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetWorkspaceInviteForm initialValues={initialValues} />
      </CardContent>
    </Card>
  );
};
