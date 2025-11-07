import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { UpdateProjectForm } from "@/components/update-project-form";
import { DeleteProjectFormCard } from "@/components/delete-project-form-card";

export const UpdateProjectModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Edit a project</DialogDescription>
        </DialogHeader>
        <UpdateProjectForm closeModal={closeModal} />
        <Separator className="opacity-0" />
        <DeleteProjectFormCard />
      </DialogContent>
    </Dialog>
  );
};
