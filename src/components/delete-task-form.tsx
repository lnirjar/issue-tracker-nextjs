"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Form } from "@/components/ui/form";

import { useDeleteTaskMutation } from "@/hooks/mutations/useDeleteTaskMutation";

import {
  DELETE_TASK_ERROR_MESSAGE,
  DELETE_TASK_LOADING_MESSAGE,
  DELETE_TASK_SUCCESS_MESSAGE,
} from "@/lib/constants";

interface DeleteTaskFormProps {
  taskId: string;
}

export const DeleteTaskForm = ({ taskId }: DeleteTaskFormProps) => {
  const mutation = useDeleteTaskMutation();

  const form = useForm();

  function onSubmit() {
    const result = mutation.mutateAsync(taskId, {
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: DELETE_TASK_LOADING_MESSAGE,
      success: DELETE_TASK_SUCCESS_MESSAGE,
      error: DELETE_TASK_ERROR_MESSAGE,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 w-full flex-1 text-red-600 focus:text-red-600"
        >
          <TrashIcon className="size-4 mr-2 stroke-2" />
          Delete Task
        </button>
      </form>
    </Form>
  );
};
