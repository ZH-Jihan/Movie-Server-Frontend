import { Skeleton } from "@/components/ui/skeleton";

export default function MediaGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <Skeleton className="w-full aspect-[2/3] mb-2" />
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
