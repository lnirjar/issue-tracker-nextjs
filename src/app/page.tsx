import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { LandingPage } from "@/components/landing-page";
import { CreateWorkspaceFormCard } from "@/components/create-workspace-form-card";
import { LandingPageNavbar } from "@/components/landing-page-navbar";
import { getUserWorkspaces } from "@/lib/workspace";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  const workspaces = await getUserWorkspaces();

  if (workspaces.length > 0) {
    const workspaceId = workspaces[0]._id.toString();
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-xl p-4">
        <LandingPageNavbar />
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          <CreateWorkspaceFormCard />
        </div>
      </div>
    </div>
  );
}
