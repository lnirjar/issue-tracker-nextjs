import { TerminalIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const TaskNotFoundAlert = () => {
  return (
    <Alert className="w-fit">
      <TerminalIcon className="h-5 w-5" />
      <AlertTitle className="text-lg">Task Not Found</AlertTitle>
      <AlertDescription>
        This task does not exist or you are not a member of this workspace
      </AlertDescription>
    </Alert>
  );
};
