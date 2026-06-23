import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"

import {
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_PAGE_SIZE,
  SKELETON_GRID_COUNT,
} from "@/constants/app-config"
import { buildPath } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/feedback/EmptyState"
import { BookStackArt } from "@/components/feedback/EmptyStateArt"
import { ErrorState } from "@/components/feedback/ErrorState"
import { Seo } from "@/components/seo/Seo"
import { Button } from "@/components/ui/button"

import { BookCardSkeleton } from "../components/BookCardSkeleton"
import { BookGrid } from "../components/BookGrid"
import { BookSearch } from "../components/BookSearch"
import { useBookSearch } from "../hooks/useBookSearch"

export function BrowsePage() {
  const { input, setInput, term, page, setPage, query } = useBookSearch()

  const hasQuery = term.trim().length >= SEARCH_MIN_QUERY_LENGTH
  const total = query.data?.total ?? 0
  const books = query.data?.books ?? []
  const hasPrev = page > 1
  const hasNext = page * SEARCH_PAGE_SIZE < total

  return (
    <div className="space-y-6">
      <Seo
        title="Browse"
        description="Search millions of books from the Open Library."
        path={buildPath.browse()}
      />

      <PageHeader
        title="Browse books"
        description="Search the Open Library by title, author or subject."
      />

      <BookSearch value={input} onChange={setInput} autoFocus />

      {!hasQuery ? (
        <EmptyState
          illustration={<BookStackArt />}
          title="Find your next read"
          description={UI_LABELS.feedback.searchPrompt}
        />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : query.isPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: SKELETON_GRID_COUNT }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState description={UI_LABELS.feedback.emptyResults} />
      ) : (
        <div className="space-y-6" aria-busy={query.isFetching}>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} result{total === 1 ? "" : "s"} for “{term}”
          </p>

          <BookGrid books={books} />

          {(hasPrev || hasNext) && (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-center gap-4 pt-2"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <RiArrowLeftSLine />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <RiArrowRightSLine />
              </Button>
            </nav>
          )}
        </div>
      )}
    </div>
  )
}
