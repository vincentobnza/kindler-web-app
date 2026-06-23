import type { Book } from "@/types/book"

export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: "OL893415W",
    title: "Dune",
    authors: ["Frank Herbert"],
    coverId: 11481354,
    coverEdition: "OL32848840M",
    firstPublishYear: 1965,
    editionCount: 120,
    ratingsAverage: 4.31,
    pageCount: 592,
    hasFulltext: true,
    ...overrides,
  }
}

export const BOOKS: Book[] = [
  makeBook({ id: "OL893415W", title: "Dune", authors: ["Frank Herbert"] }),
  makeBook({
    id: "OL27479W",
    title: "The Left Hand of Darkness",
    authors: ["Ursula K. Le Guin"],
    coverId: 8231856,
    firstPublishYear: 1969,
  }),
  makeBook({
    id: "OL3454854W",
    title: "Neuromancer",
    authors: ["William Gibson"],
    coverId: 9255566,
    firstPublishYear: 1984,
  }),
]
