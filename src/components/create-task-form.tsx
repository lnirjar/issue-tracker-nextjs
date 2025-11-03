"use client";

import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/date-picker";
import { WorkspaceAvatar } from "@/components/workspace-avatar";

import { CreateTaskFormData, createTaskFormSchema } from "@/schemas/task";
import { useCreateTaskMutation } from "@/hooks/mutations/useCreateTaskMutation";
import { useWorkspaceMembersDataQuery } from "@/hooks/queries/useWorkspaceMembersDataQuery";
import { useWorkspaceProjectsDataQuery } from "@/hooks/queries/useWorkspaceProjectsDataQuery";
import { useProjectId } from "@/app/(dashboard)/workspaces/hooks/use-project-id";
import { useWorkspaceId } from "@/app/(dashboard)/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";
import {
  BACKLOG,
  CREATE_TASK_ERROR_MESSAGE,
  CREATE_TASK_LOADING_MESSAGE,
  CREATE_TASK_SUCCESS_MESSAGE,
  TASK_STATUSES,
  TaskStatus,
} from "@/lib/constants";

export const CreateTaskForm = ({
  status = BACKLOG,
  closeModal,
}: {
  status?: TaskStatus;
  closeModal?: () => void;
}) => {
  const router = useRouter();

  const membersQuery = useWorkspaceMembersDataQuery({});
  const projectsQuery = useWorkspaceProjectsDataQuery({});
  const mutation = useCreateTaskMutation();

  const projectIdFromURL = useProjectId();
  const workspaceId = useWorkspaceId();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      name: "",
      status: status,
      projectId: projectsQuery.data?.projects.find(
        (project) => project._id.toString() === projectIdFromURL
      )
        ? projectIdFromURL
        : undefined,
    },
  });

  function onSubmit(values: CreateTaskFormData) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        const projectId = data.task.project._id.toString();

        if (projectIdFromURL && projectIdFromURL !== projectId) {
          router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
        } else {
          closeModal?.();
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: CREATE_TASK_LOADING_MESSAGE,
      success: CREATE_TASK_SUCCESS_MESSAGE,
      error: CREATE_TASK_ERROR_MESSAGE,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of your task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    {membersQuery.isLoading || membersQuery.isPending ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <SelectTrigger
                        className={cn("pl-0", field.value ? "" : "pl-3")}
                      >
                        <SelectValue placeholder="Select an Assignee" />
                      </SelectTrigger>
                    )}
                  </FormControl>
                  <SelectContent>
                    {membersQuery.isLoading || membersQuery.isPending
                      ? "Loading..."
                      : membersQuery.data?.members.map((member) => (
                          <SelectItem
                            key={member._id.toString()}
                            value={member.user._id.toString()}
                            className="pl-0"
                          >
                            <div className="flex gap-2 items-center">
                              <WorkspaceAvatar
                                name={member.user.name}
                                image={member.user.avatar}
                                className="size-8"
                              />
                              <span className="truncate">
                                {member.user.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    {projectsQuery.isLoading || projectsQuery.isPending ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <SelectTrigger
                        className={cn("pl-0", field.value ? "" : "pl-3")}
                      >
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    )}
                  </FormControl>
                  <SelectContent>
                    {projectsQuery.isLoading || projectsQuery.isPending
                      ? "Loading..."
                      : projectsQuery.data?.projects.map((project) => (
                          <SelectItem
                            key={project._id.toString()}
                            value={project._id.toString()}
                            className="pl-0"
                          >
                            <div className="flex gap-2 items-center">
                              <WorkspaceAvatar
                                name={project.name}
                                image={project.image}
                                className="size-8"
                              />
                              <span className="truncate">{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
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
