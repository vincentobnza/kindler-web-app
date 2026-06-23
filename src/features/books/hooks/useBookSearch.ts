import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { INPUT_DEBOUNCE_MS } from "@/constants/app-config"
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue"

import { searchBooksQueryOptions } from "../queries/book-queries"

/**
 * Search experience for the Browse page. The `?q=` query param is the source of
 * truth (shareable, back-button friendly): the input mirrors it, debounces, and
 * writes the debounced value back to the URL. The TanStack Query result is
 * driven by the same debounced term + page.
 */
export function useBookSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""

  const [input, setInput] = useState(q)
  const term = useDebouncedValue(input, INPUT_DEBOUNCE_MS)
  const [page, setPage] = useState(1)

  // A new search term always returns to the first page. This render-time reset
  // is React's recommended alternative to resetting state inside an effect.
  const [termForPage, setTermForPage] = useState(term)
  if (term !== termForPage) {
    setTermForPage(term)
    setPage(1)
  }

  // Reflect the debounced term in the URL without stacking history entries.
  useEffect(() => {
    if (term !== q) {
      setSearchParams(term ? { q: term } : {}, { replace: true })
    }
  }, [term, q, setSearchParams])

  const query = useQuery(searchBooksQueryOptions(term, page))

  return { input, setInput, term, page, setPage, query }
}
