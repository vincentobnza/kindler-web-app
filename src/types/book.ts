/**
 * Shared domain + API types for books. The `Book` view model is the normalised
 * shape the UI consumes; the `*Response` / `*Doc` interfaces mirror the raw
 * Open Library payloads and never leak past the service layer.
 */

/** Normalised book summary used across cards, grids and the library. */
export interface Book {
  /** Open Library work id WITHOUT the `/works/` prefix, e.g. "OL893415W". */
  id: string
  title: string
  authors: string[]
  /** Numeric cover id (covers CDN), if any. */
  coverId?: number
  /** Edition OLID used as a cover fallback when no numeric id exists. */
  coverEdition?: string
  firstPublishYear?: number
  editionCount?: number
  /** Average rating, 0–5, when the work has been rated. */
  ratingsAverage?: number
  pageCount?: number
  /** True when a full-text scan is readable online (Internet Archive). */
  hasFulltext: boolean
}

/** Detail view model used by the single-book page. */
export interface BookDetail {
  id: string
  title: string
  authors: string[]
  description?: string
  coverId?: number
  subjects: string[]
  firstPublishDate?: string
  /** Canonical Open Library work URL (borrow / read / editions). */
  openLibraryUrl: string
}

/* --- Raw Open Library payloads (service-layer only) ---------------------- */

/** A document from `/search.json`. */
export interface SearchDoc {
  key: string
  title: string
  author_name?: string[]
  author_key?: string[]
  cover_i?: number
  cover_edition_key?: string
  first_publish_year?: number
  edition_count?: number
  ia?: string[]
  ratings_average?: number
  number_of_pages_median?: number
  language?: string[]
  subject?: string[]
}

export interface SearchResponse {
  numFound: number
  start: number
  docs: SearchDoc[]
}

/** A work entry inside a `/subjects/{slug}.json` response. */
export interface SubjectWork {
  key: string
  title: string
  cover_id?: number
  cover_edition_key?: string
  edition_count?: number
  first_publish_year?: number
  ia?: string[]
  has_fulltext?: boolean
  authors?: Array<{ key: string; name: string }>
}

export interface SubjectResponse {
  key: string
  name: string
  work_count: number
  works: SubjectWork[]
}

/** Response from `/works/{id}.json`. */
export interface WorkDetailResponse {
  key: string
  title: string
  description?: string | { value: string }
  covers?: number[]
  subjects?: string[]
  first_publish_date?: string
  authors?: Array<{ author: { key: string }; type?: { key: string } }>
}

/** Response from `/authors/{id}.json`. */
export interface AuthorResponse {
  key: string
  name?: string
}
