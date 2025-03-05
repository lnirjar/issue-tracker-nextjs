import { getCurrentUser } from "@/lib/user";
import { Workspace } from "@/models/workspace";
import { createWorkspaceFormSchema } from "@/schemas/workspace";
import { AUTH_REQUIRED_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ message: AUTH_REQUIRED_MESSAGE }, { status: 401 });
    }

    const data = await request.json();

    const parsed = createWorkspaceFormSchema.safeParse(data);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0].message,
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    const workspace = await Workspace.create({ name, user: user._id });

    return Response.json(workspace, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: UNKNOWN_ERROR_MESSAGE }, { status: 500 });
  }
}
