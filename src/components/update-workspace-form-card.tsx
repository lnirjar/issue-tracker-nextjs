import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateWorkspaceForm } from "@/components/update-workspace-form";
import { getUserWorkspace } from "@/lib/workspace";

export const UpdateWorkspaceFormCard = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const workspace = await getUserWorkspace(workspaceId);
  const initialValues = {
    name: workspace.name,
    image: workspace.image ?? undefined,
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Edit workspace</CardTitle>
        <CardDescription>Update your workspace details</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateWorkspaceForm initialValues={initialValues} />
      </CardContent>
    </Card>
  );
};
