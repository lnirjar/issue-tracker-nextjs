import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { DashboardPage } from "@/components/dashboard-page";
import { LandingPage } from "@/components/landing-page";
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

  return userId ? <DashboardPage /> : <LandingPage />;
}
