/**
 * Single source of truth for every API path the client calls.
 *
 * Search + works are served from `ENV.apiBaseUrl` (openlibrary.org) and use
 * relative paths. Cover images live on a separate CDN (`ENV.coversBaseUrl`),
 * so those helpers return absolute URLs for use directly in `<img src>`.
 */

import { ENV } from "@/config/env"

/** Fields requested from the search endpoint — keeps responses small. */
const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "author_key",
  "cover_i",
  "cover_edition_key",
  "first_publish_year",
  "edition_count",
  "ia",
  "ratings_average",
  "number_of_pages_median",
  "language",
  "subject",
].join(",")

export interface SearchParams {
  query: string
  page?: number
  limit?: number
}

export const COVER_SIZES = ["S", "M", "L"] as const
export type CoverSize = (typeof COVER_SIZES)[number]

/** Strips the `/works/` or `/books/` prefix Open Library keys carry. */
function bareId(workId: string): string {
  return workId.replace(/^\/(?:works|books)\//, "")
}

export const API_ENDPOINTS = {
  search: ({ query, page = 1, limit = 24 }: SearchParams): string => {
    const params = new URLSearchParams({
      q: query,
      fields: SEARCH_FIELDS,
      page: String(page),
      limit: String(limit),
    })
    return `/search.json?${params.toString()}`
  },

  work: (workId: string): string => `/works/${bareId(workId)}.json`,

  author: (authorKey: string): string =>
    `/authors/${authorKey.replace(/^\/authors\//, "")}.json`,

  subject: (subject: string, limit = 18): string => {
    const params = new URLSearchParams({ limit: String(limit) })
    return `/subjects/${subject}.json?${params.toString()}`
  },

  /** Absolute cover-image URL by numeric cover id. */
  coverById: (coverId: number, size: CoverSize = "M"): string =>
    `${ENV.coversBaseUrl}/b/id/${coverId}-${size}.jpg`,

  /** Absolute cover-image URL by edition OLID (fallback when no cover id). */
  coverByOlid: (olid: string, size: CoverSize = "M"): string =>
    `${ENV.coversBaseUrl}/b/olid/${olid}-${size}.jpg`,
} as const
