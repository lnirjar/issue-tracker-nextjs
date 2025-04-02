"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useJoinWorkspaceMutation } from "@/hooks/mutations/useJoinWorkspaceMutation";
import {
  JOIN_WORKSPACE_ERROR_MESSAGE,
  JOIN_WORKSPACE_LOADING_MESSAGE,
  JOIN_WORKSPACE_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const JoinWorkspaceForm = () => {
  const mutation = useJoinWorkspaceMutation();

  const router = useRouter();

  const form = useForm();

  function onSubmit() {
    const result = mutation.mutateAsync(undefined, {
      onSuccess: (data) => {
        router.replace(`/workspaces/${data.workspace._id.toString()}`);
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: JOIN_WORKSPACE_LOADING_MESSAGE,
      success: JOIN_WORKSPACE_SUCCESS_MESSAGE,
      error: JOIN_WORKSPACE_ERROR_MESSAGE,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Button type="submit" className="w-full">
          Join Workspace
        </Button>
      </form>
    </Form>
  );
};
