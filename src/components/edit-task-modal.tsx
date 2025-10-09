import { Dispatch, SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditTaskForm } from "@/components/edit-task-form";
import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";

export const EditTaskModal = ({
  task,
  open,
  setOpen,
  children,
}: {
  task: GetTasksResponse["tasks"][number];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}) => {
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Edit a task</DialogDescription>
        </DialogHeader>
        <EditTaskForm closeModal={closeModal} task={task} />
      </DialogContent>
    </Dialog>
  );
};
