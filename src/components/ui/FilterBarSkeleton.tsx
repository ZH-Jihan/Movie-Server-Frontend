import { Skeleton } from "@/components/ui/skeleton";

export default function FilterBarSkeleton() {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 mb-8 items-center">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-72 col-span-2 md:col-span-1" />
      <Skeleton className="h-6 w-24 col-span-2 md:ml-auto" />
    </div>
  );
}
