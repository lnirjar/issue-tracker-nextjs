export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return (
    <div>
      <div>Workspace {workspaceId}</div>
    </div>
  );
}
