"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  CreateWorkspaceFormData,
  createWorkspaceFormSchema,
} from "@/schemas/workspace";
import { useCreateWorkspaceMutation } from "@/hooks/mutations/useCreateWorkspaceMutation";
import { toast } from "sonner";
import {
  CREATE_WORKSPACE_ERROR_MESSAGE,
  CREATE_WORKSPACE_LOADING_MESSAGE,
  CREATE_WORKSPACE_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const CreateWorkspaceForm = ({
  closeModal,
}: {
  closeModal?: () => void;
}) => {
  const mutation = useCreateWorkspaceMutation();

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: CreateWorkspaceFormData) {
    const result = mutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        closeModal?.();
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: CREATE_WORKSPACE_LOADING_MESSAGE,
      success: CREATE_WORKSPACE_SUCCESS_MESSAGE,
      error: CREATE_WORKSPACE_ERROR_MESSAGE,
    });
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Create workspace</CardTitle>
        <CardDescription>Create a new workspace</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of your workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              Create
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
