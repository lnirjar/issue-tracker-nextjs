"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";
import { useDeleteProjectMutation } from "@/hooks/mutations/useDeleteProjectMutation";
import {
  DELETE_PROJECT_ERROR_MESSAGE,
  DELETE_PROJECT_LOADING_MESSAGE,
  DELETE_PROJECT_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const DeleteProjectForm = () => {
  const workspaceId = useWorkspaceId();
  const mutation = useDeleteProjectMutation();

  const router = useRouter();

  const form = useForm();

  function onSubmit() {
    const result = mutation.mutateAsync(undefined, {
      onSuccess: () => {
        router.replace(`/workspaces/${workspaceId}`);
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: DELETE_PROJECT_LOADING_MESSAGE,
      success: DELETE_PROJECT_SUCCESS_MESSAGE,
      error: DELETE_PROJECT_ERROR_MESSAGE,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Button type="submit" variant="destructive">
          Delete
        </Button>
      </form>
    </Form>
  );
};
