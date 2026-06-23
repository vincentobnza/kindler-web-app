import { BookCard, type BookCardItem } from "./BookCard"

interface BookGridProps {
  books: BookCardItem[]
}

/** Responsive, mobile-first grid of book cards (2 → 3 → 4 columns). */
export function BookGrid({ books }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
