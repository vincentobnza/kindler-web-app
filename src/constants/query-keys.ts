/**
 * Centralised TanStack Query key factory for cache consistency. Keys are
 * hierarchical so partial invalidation works (e.g. invalidate `["books"]` to
 * drop every search, subject shelf and detail entry).
 */

export const QUERY_KEYS = {
  books: () => ["books"] as const,
  bookSearch: (query: string, page: number) =>
    ["books", "search", query, page] as const,
  book: (bookId: string) => ["books", "detail", bookId] as const,
  bookText: (bookId: string) => ["books", "text", bookId] as const,
  subject: (subject: string) => ["books", "subject", subject] as const,
} as const
