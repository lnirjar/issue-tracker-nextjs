import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateTaskForm } from "@/components/create-task-form";
import { TaskStatus } from "@/lib/constants";

export const CreateTaskModal = ({
  status,
  children,
}: {
  status?: TaskStatus;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Create a task</DialogDescription>
        </DialogHeader>
        <CreateTaskForm status={status} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
};
