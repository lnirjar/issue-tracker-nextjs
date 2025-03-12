"use client";

import axios from "axios";
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
  enabled,
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkpaces,
    enabled,
  });
};
