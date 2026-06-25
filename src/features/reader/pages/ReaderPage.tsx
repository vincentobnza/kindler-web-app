import { useEffect, useRef, useState } from "react"
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

export function ReaderPage() {
  const { bookId = "" } = useParams()
  const book = useBook(bookId)
  const text = useBookText(bookId)

  const [fontScale, setFontScale] = useState<number>(READER_FONT_SCALE.default)
  // Captured once at mount so the saved position survives the first persist.
  const [initialSection] = useState(
    () => useReadingProgressStore.getState().pages[bookId] ?? 0
  )
  const [topSection, setTopSection] = useState(initialSection)

  // The whole book is chunked into sections; pure + memoized by the compiler.
  const sections = text.data
    ? paginate(text.data.paragraphs, READER_CHARS_PER_SECTION)
    : []
  const totalSections = sections.length

  const sectionEls = useRef<(HTMLElement | null)[]>([])
  const visibleRef = useRef<Set<number>>(new Set())
  const restoredRef = useRef(false)

  const title = book.data?.title ?? "Reading"
  const authors = book.data ? formatAuthors(book.data.authors, 3) : ""

  // Track the top-most visible section (drives progress + resume position).
  useEffect(() => {
    if (totalSections === 0) return
    const visible = visibleRef.current
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const index = Number((entry.target as HTMLElement).dataset.section)
        if (entry.isIntersecting) visible.add(index)
        else visible.delete(index)
      }
      if (visible.size > 0) setTopSection(Math.min(...visible))
    })
    const els = sectionEls.current.slice(0, totalSections).filter(Boolean)
    els.forEach((el) => observer.observe(el as HTMLElement))
    return () => observer.disconnect()
  }, [totalSections])

  // Persist the top visible section so the reader resumes here next time.
  useEffect(() => {
    if (totalSections === 0) return
    const clamped = Math.min(topSection, totalSections - 1)
    useReadingProgressStore.getState().setPage(bookId, clamped)
  }, [bookId, topSection, totalSections])

  // On open ("Continue reading"), glide to the saved section (once). Smooth
  // unless the reader prefers reduced motion, in which case we jump instantly.
  useEffect(() => {
    if (totalSections === 0 || restoredRef.current) return
    restoredRef.current = true
    const saved = useReadingProgressStore.getState().pages[bookId] ?? 0
    if (saved <= 0) return
    const el = sectionEls.current[Math.min(saved, totalSections - 1)]
    if (!el) return
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    // Defer one frame so layout is settled before the animation starts.
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      })
    })
  }, [bookId, totalSections])

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

      {/* One continuous reading column on the paper background — no card. */}
      <article
        className="prose-reading mx-auto max-w-prose text-foreground/90"
        style={{ fontSize: `${fontScale * 1.0625}rem` }}
      >
        {sections.map((section, index) => (
          <section
            key={index}
            data-section={index}
            ref={(el) => {
              sectionEls.current[index] = el
            }}
            // Browser-level virtualization: skip rendering off-screen sections.
            className="scroll-mt-36 [contain-intrinsic-size:auto_640px] [content-visibility:auto]"
          >
            {section.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="mb-4 text-justify [hyphens:auto]"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
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
