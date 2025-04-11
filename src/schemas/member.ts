import { ADMIN, MEMBER } from "@/lib/constants";
import { z } from "zod";

export const changeMemberRoleSchema = z.object({
  role: z.enum([ADMIN, MEMBER], {
    message: "Role must be either admin or member",
  }),
});

export type ChangeMemberRoleData = z.infer<typeof changeMemberRoleSchema>;
