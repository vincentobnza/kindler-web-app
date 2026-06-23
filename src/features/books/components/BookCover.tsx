import { useState } from "react"

import type { CoverSize } from "@/constants/api-endpoints"
import { bookCoverUrl } from "@/lib/format/book"
import { useInViewport } from "@/lib/hooks/useInViewport"
import { cn } from "@/lib/utils"

/**
 * Nominal 2:3 intrinsic dimensions per Open Library size, given to the browser
 * so it can reserve space and schedule decoding without waiting for headers.
 */
const COVER_DIMENSIONS: Record<CoverSize, { width: number; height: number }> = {
  S: { width: 90, height: 135 },
  M: { width: 180, height: 270 },
  L: { width: 400, height: 600 },
}

interface BookCoverProps {
  title: string
  coverId?: number
  coverEdition?: string
  size?: CoverSize
  /** Eager-load + high fetch priority for above-the-fold covers (e.g. detail). */
  priority?: boolean
  className?: string
}

/**
 * Book cover image with a graceful, on-brand fallback when the book has no
 * cover or the image fails to load. Always renders a 2:3 book aspect ratio
 * (so there's no layout shift) and loads efficiently: the request is deferred
 * via `IntersectionObserver` until the cover nears the viewport (eager for
 * `priority` covers), sized to the rendered thumbnail to avoid over-fetching,
 * async-decoded with intrinsic dimensions, and faded in over a muted
 * placeholder so slow loads feel smooth.
 */
export function BookCover({
  title,
  coverId,
  coverEdition,
  size = "M",
  priority = false,
  className,
}: BookCoverProps) {
  const src = bookCoverUrl({ coverId, coverEdition }, size)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // Start fetching ~one screen early; skip the gate entirely for priority covers.
  const { ref: viewRef, inView } = useInViewport<HTMLDivElement>()

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex aspect-2/3 w-full flex-col items-center justify-center gap-2 bg-muted p-4 text-center",
          className
        )}
      >
        <span className="line-clamp-3 font-heading text-sm font-bold text-muted-foreground/40 italic">
          {title}
        </span>
      </div>
    )
  }

  const { width, height } = COVER_DIMENSIONS[size]
  const shouldLoad = priority || inView

  return (
    <div
      ref={viewRef}
      className={cn("aspect-2/3 w-full overflow-hidden bg-muted", className)}
    >
      {shouldLoad ? (
        <img
          // Cached images can finish before React attaches `onLoad`, so reveal
          // immediately when the node is already complete.
          ref={(node) => {
            if (node?.complete) setLoaded(true)
          }}
          src={src}
          width={width}
          height={height}
          alt={`Cover of ${title}`}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      ) : null}
    </div>
  )
}
