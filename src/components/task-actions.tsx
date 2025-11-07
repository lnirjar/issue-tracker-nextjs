import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteTaskForm } from "@/components/delete-task-form";
import { EditTaskModal } from "@/components/edit-task-modal";

import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";

interface TaskActionsProps {
  task: GetTasksResponse["tasks"][number];
  children: React.ReactNode;
}

export const TaskActions = ({ task, children }: TaskActionsProps) => {
  const [isOpenEditTaskModel, setOpenEditTaskModel] = useState(false);

  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const projectIdFromURL = useProjectId();

  const id = task._id.toString();
  const projectId = task.project._id.toString();

  const onOpenTaskDetails = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const onOpenEditTaskModel = () => {
    setOpenEditTaskModel(true);
  };

  return (
    <>
      <EditTaskModal
        task={task}
        open={isOpenEditTaskModel}
        setOpen={setOpenEditTaskModel}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTaskDetails}>
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          {projectId !== projectIdFromURL && (
            <DropdownMenuItem onClick={onOpenProject}>
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Open Project
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onOpenEditTaskModel}>
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>
            <DeleteTaskForm taskId={id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
