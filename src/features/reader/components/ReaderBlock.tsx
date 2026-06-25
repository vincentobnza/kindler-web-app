import { cn } from "@/lib/utils"

import type { BookBlock } from "../types"

/**
 * Renders one parsed {@link BookBlock} with print-book typography: chapter
 * headings set apart with an optional small-caps kicker, scene breaks as a
 * centered ornament, and prose as justified, first-line-indented paragraphs
 * (flush-left, with an opening drop cap, at the start of a chapter). All visual
 * styling lives in the `.reader-*` utilities in index.css.
 */
export function ReaderBlock({ block }: { block: BookBlock }) {
  if (block.kind === "break") {
    return <div className="reader-break" role="separator" aria-hidden="true" />
  }

  if (block.kind === "heading") {
    return (
      <h2 className="reader-heading">
        {block.kicker ? (
          <span className="reader-kicker">{block.kicker}</span>
        ) : null}
        <span className="reader-title">{block.title}</span>
      </h2>
    )
  }

  return (
    <p
      className={cn(
        "reader-paragraph",
        block.opensSection && "reader-opening",
        block.dropCap && "reader-dropcap"
      )}
    >
      {block.text}
    </p>
  )
}
