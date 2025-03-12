import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Skeleton className="w-40 h-40" />
    </div>
  );
}
