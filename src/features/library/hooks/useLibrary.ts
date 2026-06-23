import { useMemo } from "react"

import { useLibraryStore } from "../stores/saved-books-store"

/** Returns the library as a sorted list (most-recently-saved first) + actions. */
export function useLibrary() {
  const items = useLibraryStore((state) => state.items)
  const toggle = useLibraryStore((state) => state.toggle)
  const remove = useLibraryStore((state) => state.remove)
  const clear = useLibraryStore((state) => state.clear)

  const list = useMemo(
    () => Object.values(items).sort((a, b) => b.addedAt - a.addedAt),
    [items]
  )

  return { list, count: list.length, toggle, remove, clear }
}

/** Subscribes to whether a single book id is currently saved. */
export function useIsSaved(id: string): boolean {
  return useLibraryStore((state) => Boolean(state.items[id]))
}
