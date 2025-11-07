import { getWorkspaceMembers } from "@/lib/workspace";
import { handleError } from "@/lib/error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const members = await getWorkspaceMembers(workspaceId);
    return Response.json({ members }, { status: 200 });
  } catch (error) {
    const { message, status } = handleError(error);
    return Response.json({ message }, { status });
  }
}
