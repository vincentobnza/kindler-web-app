import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EmptyState } from "@/components/feedback/EmptyState"

describe("<EmptyState />", () => {
  it("renders a default title", () => {
    render(<EmptyState />)
    expect(
      screen.getByRole("heading", { name: /nothing here yet/i })
    ).toBeInTheDocument()
  })

  it("renders a custom description and action", () => {
    render(
      <EmptyState
        description="No widgets found."
        action={<button type="button">Add widget</button>}
      />
    )
    expect(screen.getByText("No widgets found.")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Add widget" })
    ).toBeInTheDocument()
  })
})
