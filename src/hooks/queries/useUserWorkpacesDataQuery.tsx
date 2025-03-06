import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { Workspace } from "@/models/workspace";

interface GetUserWorkspacesResponse {
  workspaces: Workspace[];
}

const getUserWorkpaces = () => {
  return axios.get<GetUserWorkspacesResponse>("/api/workspaces");
};

export const useUserWorkspacesDataQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkpaces,
  });
};
