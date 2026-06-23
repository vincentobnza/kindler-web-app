import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri"

import { UI_LABELS } from "@/constants/ui-labels"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useLibraryStore } from "../stores/saved-books-store"
import type { SaveableBook } from "../types"

interface SaveButtonProps {
  book: SaveableBook
  /** Render a full labelled button (detail page) instead of an icon button. */
  withLabel?: boolean
  className?: string
}

/** Toggles a book's saved status. Reads its own state from the store. */
export function SaveButton({
  book,
  withLabel = false,
  className,
}: SaveButtonProps) {
  const isSaved = useLibraryStore((state) => Boolean(state.items[book.id]))
  const toggle = useLibraryStore((state) => state.toggle)

  const label = isSaved
    ? UI_LABELS.actions.removeFromLibrary
    : UI_LABELS.actions.saveToLibrary

  if (withLabel) {
    return (
      <Button
        type="button"
        variant={isSaved ? "secondary" : "default"}
        aria-pressed={isSaved}
        onClick={() => toggle(book)}
        className={className}
      >
        {isSaved ? <RiBookmarkFill /> : <RiBookmarkLine />}
        {label}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={isSaved}
      aria-label={label}
      title={label}
      onClick={(event) => {
        // Cards wrap the button in a <Link>; don't navigate on toggle.
        event.preventDefault()
        event.stopPropagation()
        toggle(book)
      }}
      className={cn(
        "rounded-full border border-border bg-card text-foreground hover:bg-accent",
        className
      )}
    >
      {isSaved ? <RiBookmarkFill /> : <RiBookmarkLine />}
    </Button>
  )
}
