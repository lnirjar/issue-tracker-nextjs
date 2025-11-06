import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { WorkspaceDetails } from "@/components/workspace-details";
import { InviteWorkspaceMembersCard } from "@/components/invite-workspace-members-card";
import { WorkspaceAnalyticsCardsContainer } from "@/components/workspace-analytics-cards-container";
import { TasksChartPieDonutText } from "@/components/tasks-chart-pie-donut";

import { dbConnect } from "@/lib/db";
import { getWorkspaceMember } from "@/lib/workspace";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  await dbConnect();

  const { workspaceId } = await params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    notFound();
  }

  const member = await getWorkspaceMember(workspaceId);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceDetails />
      <InviteWorkspaceMembersCard />
      <WorkspaceAnalyticsCardsContainer />
      <TasksChartPieDonutText />
    </div>
  );
}
