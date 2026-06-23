import { Skeleton } from "@/components/ui/skeleton"

/** Loading placeholder matching the BookCard footprint to avoid layout shift. */
export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
      <Skeleton className="aspect-2/3 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
