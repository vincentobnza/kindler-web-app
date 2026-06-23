import { useState } from "react"

import type { CoverSize } from "@/constants/api-endpoints"
import { bookCoverUrl } from "@/lib/format/book"
import { cn } from "@/lib/utils"

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
 * Book cover image with a graceful, on-brand placeholder when the book has no
 * cover or the image fails to load. Always renders a 2:3 book aspect ratio
 * (so there's no layout shift) and loads efficiently: lazy + async-decoded by
 * default, with a retina `srcSet` for the small grid/shelf covers.
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

  // Serve a sharper image on high-DPR screens without over-fetching on the
  // small (grid/shelf) covers: M for 1x, L for 2x.
  const srcSet =
    size === "M"
      ? `${bookCoverUrl({ coverId, coverEdition }, "M")} 1x, ${bookCoverUrl(
          { coverId, coverEdition },
          "L"
        )} 2x`
      : undefined

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={`Cover of ${title}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={cn("aspect-2/3 w-full bg-muted object-cover", className)}
    />
  )
}
