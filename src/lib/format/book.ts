/** Pure formatters for the book domain — trivially unit-testable. */

import { API_ENDPOINTS, type CoverSize } from "@/constants/api-endpoints"

interface CoverSource {
  coverId?: number
  coverEdition?: string
}

/**
 * Resolves a cover-image URL, preferring the numeric cover id and falling back
 * to the edition OLID. Returns `undefined` when the book has no cover so the UI
 * can render a placeholder.
 */
export function bookCoverUrl(
  source: CoverSource,
  size: CoverSize = "M"
): string | undefined {
  if (source.coverId) return API_ENDPOINTS.coverById(source.coverId, size)
  if (source.coverEdition)
    return API_ENDPOINTS.coverByOlid(source.coverEdition, size)
  return undefined
}

/** Joins author names for display, collapsing long lists to "A, B +N". */
export function formatAuthors(authors: string[], max = 2): string {
  if (authors.length === 0) return "Unknown author"
  if (authors.length <= max) return authors.join(", ")
  return `${authors.slice(0, max).join(", ")} +${authors.length - max}`
}

/** Formats an average rating to one decimal place, or `null` if unrated. */
export function formatRating(ratingsAverage?: number): string | null {
  if (typeof ratingsAverage !== "number" || Number.isNaN(ratingsAverage)) {
    return null
  }
  return ratingsAverage.toFixed(1)
}
