import { Link } from "react-router-dom"
import { RiDeleteBin6Line } from "react-icons/ri"

import { buildPath } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/feedback/EmptyState"
import { BookmarkArt } from "@/components/feedback/EmptyStateArt"
import { Seo } from "@/components/seo/Seo"
import { Button } from "@/components/ui/button"
import { BookGrid } from "@/features/books/components/BookGrid"

import { useLibrary } from "../hooks/useLibrary"

export function LibraryPage() {
  const { list, count, clear } = useLibrary()

  return (
    <div className="space-y-6">
      <Seo
        title="Library"
        description="Books you've saved to read later."
        path={buildPath.library()}
        noIndex
      />

      <PageHeader
        title="My library"
        description={
          count > 0
            ? `${count} saved book${count === 1 ? "" : "s"}, kept in your browser.`
            : "Books you save are kept locally in your browser."
        }
        actions={
          count > 0 ? (
            <Button variant="destructive" size="sm" onClick={clear}>
              <RiDeleteBin6Line />
              Clear all
            </Button>
          ) : undefined
        }
      />

      {count === 0 ? (
        <EmptyState
          illustration={<BookmarkArt />}
          title="No saved books yet"
          description={UI_LABELS.feedback.emptyLibrary}
          action={
            <Button asChild variant="outline" size="sm">
              <Link to={buildPath.browse()}>Browse books</Link>
            </Button>
          }
        />
      ) : (
        <BookGrid books={list} />
      )}
    </div>
  )
}
