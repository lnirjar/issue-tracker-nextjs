import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children?: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Task Details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
          Open Project
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilIcon className="size-4 mr-2 stroke-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          <TrashIcon className="size-4 mr-2 stroke-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
