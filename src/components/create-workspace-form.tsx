"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  CreateWorkspaceFormData,
  createWorkspaceFormSchema,
} from "@/schemas/workspace";
import { useCreateWorkspaceMutation } from "@/hooks/mutations/useCreateWorkspaceMutation";
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

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
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-16 relative rounded-md overflow-hidden">
                        <Image
                          src={URL.createObjectURL(field.value)}
                          alt="workspace logo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div>
                        <Avatar className="size-16">
                          <AvatarFallback>
                            <ImageIcon className="size-8 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm">Workspace Icon</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG or JPEG, Max size 5MB
                      </p>
                      <input
                        className="hidden"
                        type="file"
                        accept=".jpg, .png, .svg, .jpeg"
                        ref={inputRef}
                        disabled={mutation.isPending}
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        disabled={mutation.isPending}
                        variant="secondary"
                        className="mt-2 w-fit"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
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
