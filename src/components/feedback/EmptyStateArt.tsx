import { cn } from "@/lib/utils"

/**
 * Illustrations for empty states.
 *
 * `NoResultsArt` is an inline, black-outline line drawing that strokes with
 * `currentColor`, so it inherits the ink color and stays on-theme. The book and
 * bookmark illustrations are full-color, hand-drawn PNGs served from `public/`
 * (referenced by absolute path, which Vite serves at the site root). All are
 * decorative — the surrounding `EmptyState` carries the real heading/copy — so
 * the images are `aria-hidden` with an empty `alt`.
 */

type ArtProps = { className?: string }

const SVG_PROPS = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
}

/** Magnifying glass with an "×" — for "no results matched your search". */
export function NoResultsArt({ className }: ArtProps) {
  return (
    <svg {...SVG_PROPS} className={cn("size-28", className)}>
      <circle cx="50" cy="50" r="28" />
      <path d="M70 70L96 96" />
      <path d="M43 43L57 57" />
      <path d="M57 43L43 57" />
    </svg>
  )
}

/** Shelf of colorful books — for the browse / "find your next read" prompt. */
export function BookStackArt({ className }: ArtProps) {
  return (
    <img
      src="/books-empty-state-icon.png"
      alt=""
      aria-hidden
      loading="lazy"
      className={cn("size-28 object-contain", className)}
    />
  )
}

/** Ribbon bookmark — for the empty saved-books library. */
export function BookmarkArt({ className }: ArtProps) {
  return (
    <img
      src="/bookmark-empty-state-icon.png"
      alt=""
      aria-hidden
      loading="lazy"
      className={cn("size-28 object-contain", className)}
    />
  )
}
