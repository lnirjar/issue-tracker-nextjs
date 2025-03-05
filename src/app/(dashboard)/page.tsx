import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { LandingPage } from "@/components/landing-page";
import { CreateWorkspaceForm } from "@/components/create-workspace-form";
import { APP_NAME } from "@/lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  const { userId } = await auth();

  if (!userId) {
    return {};
  }

  return {
    title: `Dashboard | ${APP_NAME}`,
  };
};

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  return (
    <div>
      <CreateWorkspaceForm />
    </div>
  );
}
