import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import { LandingPage } from "@/components/landing-page";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export const generateMetadata = async (): Promise<Metadata> => {
  const { userId } = await auth();

  if (!userId) {
    return {};
  }

  return {
    title: "Dashboard",
  };
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
