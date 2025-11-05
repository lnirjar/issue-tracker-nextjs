"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { UpdateTaskFormData, updateTaskFormSchema } from "@/schemas/task";
import { useUpdateTaskMutation } from "@/hooks/mutations/useUpdateTaskMutation";
import { GetTasksResponse } from "@/hooks/queries/useTasksDataQuery";

import {
  UPDATE_TASK_ERROR_MESSAGE,
  UPDATE_TASK_LOADING_MESSAGE,
  UPDATE_TASK_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const EditTaskDescriptionForm = ({
  task,
  closeModal,
  closeEditMode,
}: {
  task: GetTasksResponse["tasks"][number];
  closeModal?: () => void;
  closeEditMode?: () => void;
}) => {
  const mutation = useUpdateTaskMutation();

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskFormSchema),
    defaultValues: {
      description: task?.description ?? "",
    },
  });

  function onSubmit(values: UpdateTaskFormData) {
    const result = mutation.mutateAsync(
      { ...values, _id: task._id.toString() },
      {
        onSuccess: () => {
          closeModal?.();
          closeEditMode?.();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );

    toast.promise(result, {
      loading: UPDATE_TASK_LOADING_MESSAGE,
      success: UPDATE_TASK_SUCCESS_MESSAGE,
      error: UPDATE_TASK_ERROR_MESSAGE,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-24"
                    placeholder="Type your task description here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between mt-6">
          <Button type="submit" disabled={mutation.isPending}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
