"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useDeleteWorkspaceMutation } from "@/hooks/mutations/useDeleteWorkspaceMutation";
import {
  DELETE_WORKSPACE_ERROR_MESSAGE,
  DELETE_WORKSPACE_LOADING_MESSAGE,
  DELETE_WORKSPACE_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const DeleteWorkspaceForm = () => {
  const mutation = useDeleteWorkspaceMutation();

  const router = useRouter();

  const form = useForm();

  function onSubmit() {
    const result = mutation.mutateAsync(undefined, {
      onSuccess: () => {
        router.replace("/workspaces");
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: DELETE_WORKSPACE_LOADING_MESSAGE,
      success: DELETE_WORKSPACE_SUCCESS_MESSAGE,
      error: DELETE_WORKSPACE_ERROR_MESSAGE,
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
