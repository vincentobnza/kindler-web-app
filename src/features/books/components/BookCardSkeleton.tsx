import { Skeleton } from "@/components/ui/skeleton"

/** Loading placeholder matching the BookCard footprint to avoid layout shift. */
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-2/3 w-full" />
      <div className="min-w-0 space-y-0.5">
        {/* title — mirrors the line-clamp-2 heading */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {/* author */}
        <Skeleton className="h-3.5 w-1/2" />
        {/* first publish year */}
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}
