import { RiCloseLine, RiSearchLine } from "react-icons/ri"

import { UI_LABELS } from "@/constants/ui-labels"
import { Input } from "@/components/ui/input"

interface BookSearchProps {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

/** Controlled search box for finding books (debounced upstream). */
export function BookSearch({ value, onChange, autoFocus }: BookSearchProps) {
  return (
    <div className="relative w-full">
      <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, author or subject…"
        aria-label={UI_LABELS.actions.search}
        autoFocus={autoFocus}
        className="h-11 pr-10 pl-9 text-base"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={UI_LABELS.actions.clearSearch}
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RiCloseLine className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
