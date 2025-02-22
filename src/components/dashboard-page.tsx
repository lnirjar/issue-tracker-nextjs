import { Navbar } from "@/components/navbar";

export const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <Navbar />
        <div className="mt-6 flex flex-col gap-4">
          <h1 className="text-6xl font-bold">Dashboard</h1>
        </div>
      </div>
    </div>
  );
};
