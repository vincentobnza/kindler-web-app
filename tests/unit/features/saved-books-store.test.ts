import { beforeEach, describe, expect, it } from "vitest"

import { useLibraryStore } from "@/features/library/stores/saved-books-store"

import { makeBook } from "../../fixtures/books"

beforeEach(() => {
  useLibraryStore.setState({ items: {} })
  localStorage.clear()
})

describe("saved-books store", () => {
  it("adds a book keyed by id", () => {
    const book = makeBook({ id: "OL1W", title: "A Wizard of Earthsea" })
    useLibraryStore.getState().add(book)

    const saved = useLibraryStore.getState().items["OL1W"]
    expect(saved).toBeDefined()
    expect(saved.title).toBe("A Wizard of Earthsea")
    expect(saved.addedAt).toBeTypeOf("number")
  })

  it("removes a book by id", () => {
    const book = makeBook({ id: "OL2W" })
    useLibraryStore.getState().add(book)
    useLibraryStore.getState().remove("OL2W")

    expect(useLibraryStore.getState().items["OL2W"]).toBeUndefined()
  })

  it("toggle returns the new saved status", () => {
    const book = makeBook({ id: "OL3W" })

    expect(useLibraryStore.getState().toggle(book)).toBe(true)
    expect(useLibraryStore.getState().items["OL3W"]).toBeDefined()

    expect(useLibraryStore.getState().toggle(book)).toBe(false)
    expect(useLibraryStore.getState().items["OL3W"]).toBeUndefined()
  })

  it("clears every saved book", () => {
    useLibraryStore.getState().add(makeBook({ id: "OL4W" }))
    useLibraryStore.getState().add(makeBook({ id: "OL5W" }))
    useLibraryStore.getState().clear()

    expect(Object.keys(useLibraryStore.getState().items)).toHaveLength(0)
  })
})
