import { TerminalIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InvitationNotFoundPage() {
  return (
    <Alert className="w-fit">
      <TerminalIcon className="h-5 w-5" />
      <AlertTitle className="text-lg">Invitation Not Found</AlertTitle>
      <AlertDescription>
        This invitation does not exist or has been expired
      </AlertDescription>
    </Alert>
  );
}
