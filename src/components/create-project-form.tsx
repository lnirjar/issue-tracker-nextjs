"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  CreateProjectFormData,
  createProjectFormSchema,
} from "@/schemas/project";
import { useCreateProjectMutation } from "@/hooks/mutations/useCreateProjectMutation";
import {
  CREATE_PROJECT_ERROR_MESSAGE,
  CREATE_PROJECT_LOADING_MESSAGE,
  CREATE_PROJECT_SUCCESS_MESSAGE,
} from "@/lib/constants";

export const CreateProjectForm = ({
  closeModal,
}: {
  closeModal?: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const mutation = useCreateProjectMutation();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: CreateProjectFormData) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        form.reset();
        const projectId = data.project._id.toString();
        const workspaceId = data.project.workspace.toString();
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
        closeModal?.();
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: CREATE_PROJECT_LOADING_MESSAGE,
      success: CREATE_PROJECT_SUCCESS_MESSAGE,
      error: CREATE_PROJECT_ERROR_MESSAGE,
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }

    // Reset input value to allow re-selection of the same file after reseting the form
    e.target.value = "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of your project" {...field} />
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
                    <div className="size-20 relative rounded-md overflow-hidden">
                      <Image
                        src={URL.createObjectURL(field.value)}
                        alt="workspace logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div>
                      <Avatar className="size-20">
                        <AvatarFallback>
                          <ImageIcon className="size-8 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm">Project Icon</p>
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
        </div>
        <div className="flex items-center justify-between mt-6">
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
        </div>
      </form>
    </Form>
  );
};
