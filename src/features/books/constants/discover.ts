/** Curated subject shelves shown on the Discover (home) page. */

export interface Shelf {
  /** Open Library subject slug used by the `/subjects/{slug}.json` endpoint. */
  subject: string
  title: string
  /** Search term the "View all" link pre-fills on the Browse page. */
  query: string
}

export const DISCOVER_SHELVES: readonly Shelf[] = [
  {
    subject: "science_fiction",
    title: "Science fiction",
    query: "science fiction",
  },
  { subject: "fantasy", title: "Fantasy", query: "fantasy" },
  {
    subject: "mystery_and_detective_stories",
    title: "Mystery & detective",
    query: "mystery",
  },
  { subject: "romance", title: "Romance", query: "romance" },
  {
    subject: "historical_fiction",
    title: "Historical fiction",
    query: "historical fiction",
  },
  { subject: "poetry", title: "Poetry", query: "poetry" },
] as const
