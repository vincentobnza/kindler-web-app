import { Link, useParams } from "react-router-dom"
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiExternalLinkLine,
  RiPriceTag3Line,
} from "react-icons/ri"

import { buildPath } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { formatAuthors } from "@/lib/format/book"
import { truncate as truncateText } from "@/lib/format/text"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"
import { Seo } from "@/components/seo/Seo"
import { Button } from "@/components/ui/button"
import { SaveButton } from "@/features/library/components/SaveButton"

import { BookCover } from "../components/BookCover"
import { useBook } from "../hooks/useBook"

const MAX_SUBJECTS = 12

export function BookDetailPage() {
  const { bookId = "" } = useParams()
  const { data: book, isPending, isError, error, refetch } = useBook(bookId)

  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isPending || !book) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <LoadingSpinner label={UI_LABELS.states.loading} />
      </div>
    )
  }

  const authors = formatAuthors(book.authors, 4)
  const subjects = book.subjects.slice(0, MAX_SUBJECTS)

  return (
    <div className="space-y-8">
      <Seo
        title={book.title}
        description={
          book.description
            ? truncateText(book.description, 155)
            : `${book.title} by ${authors}.`
        }
        path={buildPath.bookDetail(book.id)}
      />

      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to={buildPath.browse()}>
          <RiArrowLeftLine />
          {UI_LABELS.actions.back} to browse
        </Link>
      </Button>

      <header className="flex flex-col gap-6 sm:flex-row">
        <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48">
          <BookCover
            title={book.title}
            coverId={book.coverId}
            size="L"
            priority
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground">{authors}</p>
          </div>

          {book.firstPublishDate ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <RiCalendarLine className="size-4" />
              First published {book.firstPublishDate}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <SaveButton
              book={{
                id: book.id,
                title: book.title,
                authors: book.authors,
                coverId: book.coverId,
              }}
              withLabel
            />
            <Button asChild variant="outline">
              <a
                href={book.openLibraryUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <RiExternalLinkLine />
                {UI_LABELS.actions.readOnline}
              </a>
            </Button>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          About this book
        </h2>
        <p className="prose-reading max-w-prose whitespace-pre-line text-foreground/90">
          {book.description ?? UI_LABELS.feedback.noDescription}
        </p>
      </section>

      {subjects.length > 0 ? (
        <section className="space-y-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
            <RiPriceTag3Line className="size-4 text-muted-foreground" />
            Subjects
          </h2>
          <ul className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
              >
                {subject}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
