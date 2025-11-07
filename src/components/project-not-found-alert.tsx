import { TerminalIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ProjectNotFoundAlert = () => {
  return (
    <Alert className="w-fit">
      <TerminalIcon className="h-5 w-5" />
      <AlertTitle className="text-lg">Project Not Found</AlertTitle>
      <AlertDescription>
        This project does not exist or you are not a member of this workspace
      </AlertDescription>
    </Alert>
  );
};
