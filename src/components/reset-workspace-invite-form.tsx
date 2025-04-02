"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useResetWorkspaceInviteMutation } from "@/hooks/mutations/useResetWorkspaceInviteMutation";
import {
  RESET_WORKSPACE_INVITATION_LOADING_MESSAGE,
  RESET_WORKSPACE_INVITATION_SUCCESS_MESSAGE,
  RESET_WORKSPACE_INVITATION_ERROR_MESSAGE,
} from "@/lib/constants";
import { CopyIcon } from "lucide-react";

export const ResetWorkspaceInviteForm = ({
  initialValues,
}: {
  initialValues: { inviteId: string };
}) => {
  const [defaultValues, setDefaultValues] = useState(initialValues);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const mutation = useResetWorkspaceInviteMutation();

  const form = useForm();

  function onSubmit() {
    const result = mutation.mutateAsync(undefined, {
      onSuccess: (data) => {
        setDefaultValues({ inviteId: data.invitation._id.toString() });
      },
      onError: (error) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: RESET_WORKSPACE_INVITATION_LOADING_MESSAGE,
      success: RESET_WORKSPACE_INVITATION_SUCCESS_MESSAGE,
      error: RESET_WORKSPACE_INVITATION_ERROR_MESSAGE,
    });
  }

  const fullInviteLink = `${baseUrl}/invite/${defaultValues.inviteId}`;

  return (
    <Form {...form}>
      <Input readOnly value={fullInviteLink} className="mb-6" />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <Button type="submit" variant="secondary">
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(fullInviteLink);
              toast.success("Copied!");
            }}
          >
            <CopyIcon />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};
