/** Query option factory for a book's full text. */

import { queryOptions } from "@tanstack/react-query"

import { QUERY_KEYS } from "@/constants/query-keys"

import { readerService } from "../services/reader-service"

export function bookTextQueryOptions(bookId: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.bookText(bookId),
    queryFn: ({ signal }) => readerService.getBookText(bookId, signal),
    enabled: Boolean(bookId),
  })
}
