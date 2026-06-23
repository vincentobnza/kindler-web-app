import { RiStarFill } from "react-icons/ri"
import { Link } from "react-router-dom"

import { FEATURE_FLAGS } from "@/constants/feature-flags"
import { buildPath } from "@/constants/routes"
import { formatAuthors, formatRating } from "@/lib/format/book"
import { SaveButton } from "@/features/library/components/SaveButton"

import { BookCover } from "./BookCover"

/**
 * Minimal data a card needs. Satisfied by both the `Book` search/shelf model
 * and the persisted `SavedBook`, so the library reuses this card directly.
 */
export interface BookCardItem {
  id: string
  title: string
  authors: string[]
  coverId?: number
  coverEdition?: string
  firstPublishYear?: number
  ratingsAverage?: number
  hasFulltext?: boolean
}

/** Linkable, saveable cover card for a single book. */
export function BookCard({ book }: { book: BookCardItem }) {
  const rating = FEATURE_FLAGS.bookRatings
    ? formatRating(book.ratingsAverage)
    : null

  return (
    <Link
      to={buildPath.bookDetail(book.id)}
      className="group/card flex flex-col gap-3 transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="relative">
        <BookCover
          title={book.title}
          coverId={book.coverId}
          coverEdition={book.coverEdition}
          className="transition-transform duration-200 group-hover/card:-translate-y-0.5"
        />
        <div className="absolute top-2 right-2">
          <SaveButton book={book} />
        </div>
        {rating ? (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/85 px-2 py-0.5 text-xs font-medium text-foreground">
            <RiStarFill className="size-3 text-primary" />
            {rating}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 space-y-0.5">
        <h3 className="line-clamp-2 font-heading text-lg leading-6 font-semibold text-foreground sm:text-xl">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {formatAuthors(book.authors)}
        </p>
        {book.firstPublishYear ? (
          <p className="text-xs text-muted-foreground/80">
            {book.firstPublishYear}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
