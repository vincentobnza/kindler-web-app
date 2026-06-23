/** Lightweight snapshot of a saved book, persisted to localStorage. */
export interface SavedBook {
  id: string
  title: string
  authors: string[]
  coverId?: number
  coverEdition?: string
  firstPublishYear?: number
  /** Epoch ms the book was added — used to sort the library. */
  addedAt: number
}

/** Minimal shape needed to save a book (satisfied by `Book` and `BookDetail`). */
export interface SaveableBook {
  id: string
  title: string
  authors: string[]
  coverId?: number
  coverEdition?: string
  firstPublishYear?: number
}
