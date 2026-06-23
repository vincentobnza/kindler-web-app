import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { SaveButton } from "@/features/library/components/SaveButton"
import { useLibraryStore } from "@/features/library/stores/saved-books-store"

import { makeBook } from "../fixtures/books"

beforeEach(() => {
  useLibraryStore.setState({ items: {} })
  localStorage.clear()
})

describe("<SaveButton />", () => {
  it("reflects and toggles saved state", async () => {
    const book = makeBook({ id: "OL42W" })
    render(<SaveButton book={book} />)

    const button = screen.getByRole("button", { name: /save to library/i })
    expect(button).toHaveAttribute("aria-pressed", "false")

    await userEvent.click(button)

    expect(useLibraryStore.getState().items["OL42W"]).toBeDefined()
    expect(
      screen.getByRole("button", { name: /remove from library/i })
    ).toHaveAttribute("aria-pressed", "true")
  })
})
