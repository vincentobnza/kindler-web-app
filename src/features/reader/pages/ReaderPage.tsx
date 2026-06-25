import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { RiArrowLeftLine, RiExternalLinkLine } from "react-icons/ri"
import { Link, useParams } from "react-router-dom"

import {
  READER_CHARS_PER_SECTION,
  READER_FONT_SCALE,
} from "@/constants/app-config"
import { buildPath } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { formatAuthors } from "@/lib/format/book"
import { ApiError } from "@/lib/http/api-error"
import { EmptyState } from "@/components/feedback/EmptyState"
import { BookStackArt } from "@/components/feedback/EmptyStateArt"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"
import { Seo } from "@/components/seo/Seo"
import { Button } from "@/components/ui/button"
import { useBook } from "@/features/books/hooks/useBook"

import { useBookText } from "../hooks/useBookText"
import { paginate } from "../lib/paginate"
import { useReadingProgressStore } from "../stores/reading-progress-store"

/** Estimated section height (px) before measurement; the virtualizer corrects it. */
const SECTION_ESTIMATE = 800

/** Top inset for `scrollToIndex` so a resumed section clears the sticky bars. */
const STICKY_OFFSET = 120

export function ReaderPage() {
  const { bookId = "" } = useParams()
  const book = useBook(bookId)
  const text = useBookText(bookId)

  const [fontScale, setFontScale] = useState<number>(READER_FONT_SCALE.default)
  // Captured once at mount so resume survives the first persist (see below).
  const [initialSection] = useState(
    () => useReadingProgressStore.getState().pages[bookId] ?? 0
  )
  const [topSection, setTopSection] = useState(initialSection)

  // The whole book is chunked into sections; pure + memoized by the compiler.
  const sections = text.data
    ? paginate(text.data.paragraphs, READER_CHARS_PER_SECTION)
    : []
  const totalSections = sections.length

  const listRef = useRef<HTMLDivElement>(null)
  const restoredRef = useRef(false)
  // The window virtualizer needs the list's document offset to map page scroll
  // onto item positions; measured after layout (and on resize).
  const [scrollMargin, setScrollMargin] = useState(0)

  const title = book.data?.title ?? "Reading"
  const authors = book.data ? formatAuthors(book.data.authors, 3) : ""

  const virtualizer = useWindowVirtualizer({
    count: totalSections,
    estimateSize: () => SECTION_ESTIMATE,
    overscan: 4,
    scrollMargin,
    scrollPaddingStart: STICKY_OFFSET,
    // Track the top-most visible section for the progress bar + resume.
    onChange: (instance) => {
      const items = instance.getVirtualItems()
      if (items.length === 0) return
      const offset = instance.scrollOffset ?? 0
      const top = items.find((item) => item.start + item.size > offset)
      const index = (top ?? items[0]).index
      setTopSection((prev) => (prev === index ? prev : index))
    },
  })

  useLayoutEffect(() => {
    const measure = () => {
      if (listRef.current) setScrollMargin(listRef.current.offsetTop)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [totalSections])

  // Persist the top visible section so the reader resumes here next time.
  useEffect(() => {
    if (totalSections === 0) return
    const clamped = Math.min(topSection, totalSections - 1)
    useReadingProgressStore.getState().setPage(bookId, clamped)
  }, [bookId, topSection, totalSections])

  // On open ("Continue reading"), glide to the saved section (once). Uses the
  // mount-captured index so an early onChange can't clobber the target.
  useEffect(() => {
    if (totalSections === 0 || scrollMargin === 0 || restoredRef.current) return
    restoredRef.current = true
    if (initialSection <= 0) return
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    virtualizer.scrollToIndex(Math.min(initialSection, totalSections - 1), {
      align: "start",
      behavior: prefersReduced ? "auto" : "smooth",
    })
  }, [initialSection, totalSections, scrollMargin, virtualizer])

  const backToBook = (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link to={buildPath.bookDetail(bookId)}>
        <RiArrowLeftLine />
        {UI_LABELS.actions.back}
      </Link>
    </Button>
  )

  if (text.isError) {
    const isNoFullText =
      text.error instanceof ApiError && text.error.status === 404

    if (isNoFullText) {
      return (
        <div className="space-y-6">
          <Seo title={`Read · ${title}`} noIndex />
          {backToBook}
          <EmptyState
            illustration={<BookStackArt />}
            title="Not available to read here"
            description={UI_LABELS.feedback.noFullText}
            action={
              book.data ? (
                <Button asChild variant="outline">
                  <a
                    href={book.data.openLibraryUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <RiExternalLinkLine />
                    {UI_LABELS.actions.readOnline}
                  </a>
                </Button>
              ) : null
            }
          />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Seo title={`Read · ${title}`} noIndex />
        {backToBook}
        <ErrorState error={text.error} onRetry={() => text.refetch()} />
      </div>
    )
  }

  if (text.isPending) {
    return (
      <div className="space-y-6">
        <Seo title={`Read · ${title}`} noIndex />
        {backToBook}
        <div className="grid min-h-[40vh] place-items-center">
          <LoadingSpinner label={UI_LABELS.feedback.preparingText} />
        </div>
      </div>
    )
  }

  const progress =
    totalSections > 0
      ? ((Math.min(topSection, totalSections - 1) + 1) / totalSections) * 100
      : 0
  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div className="space-y-6">
      <Seo title={`Read · ${title}`} noIndex />

      {/* Sticky reader bar: sits just below the app's top nav (h-16). */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <header className="flex items-center justify-between gap-3 py-2">
          {backToBook}

          <div
            className="flex items-center gap-1"
            role="group"
            aria-label="Text size"
          >
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setFontScale((s) =>
                  Math.max(
                    READER_FONT_SCALE.min,
                    Number((s - READER_FONT_SCALE.step).toFixed(2))
                  )
                )
              }
              disabled={fontScale <= READER_FONT_SCALE.min}
              aria-label={UI_LABELS.actions.decreaseFont}
            >
              <span className="text-xs">A</span>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setFontScale((s) =>
                  Math.min(
                    READER_FONT_SCALE.max,
                    Number((s + READER_FONT_SCALE.step).toFixed(2))
                  )
                )
              }
              disabled={fontScale >= READER_FONT_SCALE.max}
              aria-label={UI_LABELS.actions.increaseFont}
            >
              <span className="text-base">A</span>
            </Button>
          </div>
        </header>

        <div
          className="h-0.5 w-full bg-muted"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSections}
          aria-valuenow={Math.min(topSection, totalSections - 1) + 1}
        >
          <div
            className="h-full bg-foreground transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-1 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground">
          {title}
        </h1>
        {authors ? (
          <p className="text-sm text-muted-foreground">{authors}</p>
        ) : null}
      </div>

      {/* One continuous reading column on the paper background — no card.
          Only the on-screen sections are mounted (windowed by TanStack). */}
      <article
        className="prose-reading mx-auto max-w-prose text-foreground/90"
        style={{ fontSize: `${fontScale * 1.0625}rem` }}
      >
        <div
          ref={listRef}
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((item) => (
            <div
              key={item.key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {sections[item.index].map((paragraph, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  className="mb-4 text-justify [hyphens:auto]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </article>

      <p className="text-center text-xs text-muted-foreground">
        Full text from{" "}
        <a
          href={text.data.source.url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {text.data.source.provider}
        </a>
      </p>
    </div>
  )
}
