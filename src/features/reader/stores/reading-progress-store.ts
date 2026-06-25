/**
 * Per-book reading position, persisted to localStorage so the reader resumes
 * where the user left off. Keyed by Open Library work id; the value is the
 * last viewed 0-based page index. Mirrors the saved-books store's shape.
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/storage-keys"

interface ReadingProgressState {
  pages: Record<string, number>
  setPage: (bookId: string, page: number) => void
  clear: (bookId: string) => void
}

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set) => ({
      pages: {},
      setPage: (bookId, page) =>
        set((state) => ({ pages: { ...state.pages, [bookId]: page } })),
      clear: (bookId) =>
        set((state) => {
          if (state.pages[bookId] === undefined) return state
          const next = { ...state.pages }
          delete next[bookId]
          return { pages: next }
        }),
    }),
    { name: STORAGE_KEYS.readingProgress, version: 1 }
  )
)
