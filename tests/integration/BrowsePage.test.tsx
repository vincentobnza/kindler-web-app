import { screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock the service boundary so the test exercises page → hook → query → cache
// integration without hitting the network.
vi.mock("@/features/books/services/book-service", () => ({
  bookService: {
    search: vi.fn(),
    getById: vi.fn(),
    listBySubject: vi.fn(),
  },
}))

import { BrowsePage } from "@/features/books/pages/BrowsePage"
import { bookService } from "@/features/books/services/book-service"
import { useLibraryStore } from "@/features/library/stores/saved-books-store"
import { BOOKS } from "../fixtures/books"
import { renderWithProviders } from "../utils/render"

function renderAt(initialEntry: string) {
  renderWithProviders(<BrowsePage />, { initialEntries: [initialEntry] })
}

beforeEach(() => {
  useLibraryStore.setState({ items: {} })
  localStorage.clear()
  vi.mocked(bookService.search).mockReset()
})

describe("BrowsePage (integration)", () => {
  it("renders search results from a deep link", async () => {
    vi.mocked(bookService.search).mockResolvedValue({
      books: BOOKS,
      total: BOOKS.length,
    })

    renderAt("/browse?q=dune")

    expect(await screen.findByText("Dune")).toBeInTheDocument()
    expect(screen.getByText("Neuromancer")).toBeInTheDocument()
  })

  it("prompts for a query when none is present", async () => {
    renderAt("/browse")

    expect(await screen.findByText(/find your next read/i)).toBeInTheDocument()
    expect(bookService.search).not.toHaveBeenCalled()
  })

  it("shows an empty state when nothing matches", async () => {
    vi.mocked(bookService.search).mockResolvedValue({ books: [], total: 0 })

    renderAt("/browse?q=zzzzz")

    expect(await screen.findByText(/no books matched/i)).toBeInTheDocument()
  })
})
