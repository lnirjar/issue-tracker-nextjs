"use client";

import { useParams } from "next/navigation";

export const useInviteId = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  return inviteId;
};
