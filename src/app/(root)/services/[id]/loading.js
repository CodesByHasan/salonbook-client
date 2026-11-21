import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceDetailsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading service">
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}