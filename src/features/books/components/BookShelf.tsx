import { useQuery } from "@tanstack/react-query"
import { RiArrowRightLine } from "react-icons/ri"
import { Link } from "react-router-dom"

import { buildPath } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { formatAuthors } from "@/lib/format/book"
import { SectionHeader } from "@/components/common/SectionHeader"
import { Skeleton } from "@/components/ui/skeleton"

import type { Shelf } from "../constants/discover"
import { subjectQueryOptions } from "../queries/book-queries"
import { BookCover } from "./BookCover"

const RAIL_ITEM = "w-32 shrink-0 sm:w-36"

/** A horizontally-scrolling shelf of books for a single subject. */
export function BookShelf({ shelf }: { shelf: Shelf }) {
  const { data, isPending, isError } = useQuery(
    subjectQueryOptions(shelf.subject)
  )

  // A broken/empty shelf shouldn't leave a hole in the page.
  if (isError || (!isPending && (!data || data.length === 0))) return null

  return (
    <section className="space-y-4">
      <SectionHeader
        title={shelf.title}
        action={
          <Link
            to={{
              pathname: buildPath.browse(),
              search: `?q=${encodeURIComponent(shelf.query)}`,
            }}
            className="inline-flex items-center gap-1 font-heading text-sm font-medium text-primary hover:underline sm:text-base"
          >
            {UI_LABELS.actions.viewAll}
            <RiArrowRightLine className="size-4" />
          </Link>
        }
      />

      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {isPending
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={RAIL_ITEM}>
                <Skeleton className="aspect-2/3 w-full" />
                <Skeleton className="mt-2 h-3.5 w-3/4" />
              </div>
            ))
          : data.map((book) => (
              <Link
                key={book.id}
                to={buildPath.bookDetail(book.id)}
                className="group/shelf outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className={RAIL_ITEM}>
                  <BookCover
                    title={book.title}
                    coverId={book.coverId}
                    coverEdition={book.coverEdition}
                    className="transition-transform duration-200 group-hover/shelf:-translate-y-1"
                  />
                  <p className="mt-2 mb-1 line-clamp-2 font-heading text-base leading-5 font-semibold text-foreground sm:text-lg">
                    {book.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {formatAuthors(book.authors)}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}
