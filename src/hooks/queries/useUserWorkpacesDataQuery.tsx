"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";

export interface GetUserWorkspacesResponse {
  workspaces: Workspace[];
}

const getUserWorkpaces = async () => {
  const response = await axios.get<GetUserWorkspacesResponse>(
    "/api/workspaces"
  );

  return response.data;
};

export const useUserWorkspacesDataQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkpaces,
    enabled: isMounted && enabled,
  });
};
