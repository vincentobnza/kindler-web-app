import { useQuery } from "@tanstack/react-query"

import { bookTextQueryOptions } from "../queries/reader-queries"

/** Loads a book's readable full text by its Open Library work id. */
export function useBookText(bookId: string) {
  return useQuery(bookTextQueryOptions(bookId))
}
