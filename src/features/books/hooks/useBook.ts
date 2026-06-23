import { useQuery } from "@tanstack/react-query"

import { bookQueryOptions } from "../queries/book-queries"

/** Loads a single book's detail by its Open Library work id. */
export function useBook(bookId: string) {
  return useQuery(bookQueryOptions(bookId))
}
