import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

describe("<Button />", () => {
  it("renders its children and the default variant data attribute", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("data-variant", "default")
  })

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Press" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Nope" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders as a child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/somewhere">Link</a>
      </Button>
    )
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "data-slot",
      "button"
    )
  })
})
