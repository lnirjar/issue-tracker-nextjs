import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="h-screen flex flex-col gap-6 py-6 px-4">
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="w-full h-96" />
        <Skeleton className="w-full h-96" />
      </div>
    </div>
  );
}
