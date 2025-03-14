import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspaceForm } from "@/components/create-workspace-form";

export const CreateWorkspaceFormCard = () => {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Create workspace</CardTitle>
        <CardDescription>Create a new workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateWorkspaceForm />
      </CardContent>
    </Card>
  );
};
