/** Shared query option factories so routes can prefetch and hooks can consume. */

import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { SEARCH_PAGE_SIZE, SHELF_SIZE } from "@/constants/app-config"
import { QUERY_KEYS } from "@/constants/query-keys"
import { VALIDATION_RULES } from "@/constants/validation"

import { bookService } from "../services/book-service"

export function searchBooksQueryOptions(query: string, page = 1) {
  const trimmed = query.trim()
  return queryOptions({
    queryKey: QUERY_KEYS.bookSearch(trimmed, page),
    queryFn: ({ signal }) =>
      bookService.search(
        { query: trimmed, page, limit: SEARCH_PAGE_SIZE },
        signal
      ),
    enabled: trimmed.length >= VALIDATION_RULES.search.minLength,
    placeholderData: keepPreviousData,
  })
}

export function bookQueryOptions(bookId: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.book(bookId),
    queryFn: ({ signal }) => bookService.getById(bookId, signal),
    enabled: Boolean(bookId),
  })
}

export function subjectQueryOptions(subject: string, limit = SHELF_SIZE) {
  return queryOptions({
    queryKey: QUERY_KEYS.subject(subject),
    queryFn: ({ signal }) => bookService.listBySubject(subject, limit, signal),
  })
}
