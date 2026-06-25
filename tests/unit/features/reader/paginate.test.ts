import { describe, expect, it } from "vitest"

import { paginate } from "@/features/reader/lib/paginate"

describe("paginate", () => {
  it("always returns at least one page, even when empty", () => {
    expect(paginate([], 100)).toEqual([[]])
  })

  it("keeps paragraphs that fit together on the same page", () => {
    const pages = paginate(["aaaa", "bbbb"], 100)
    expect(pages).toEqual([["aaaa", "bbbb"]])
  })

  it("starts a new page when the next paragraph would overflow", () => {
    // budget 10: "aaaaa" (5) fits; adding "bbbbbb" (6) -> 11 > 10, so it breaks.
    const pages = paginate(["aaaaa", "bbbbbb"], 10)
    expect(pages).toEqual([["aaaaa"], ["bbbbbb"]])
  })

  it("never splits a paragraph that fits within the budget", () => {
    const pages = paginate(["one", "two", "three", "four"], 8)
    for (const page of pages) {
      expect(page.length).toBeGreaterThan(0)
    }
    expect(pages.flat()).toEqual(["one", "two", "three", "four"])
  })

  it("chunks an over-long paragraph on word boundaries", () => {
    const long = "alpha beta gamma delta epsilon"
    const pages = paginate([long], 12)
    // Every chunk stays within the budget...
    for (const page of pages) {
      for (const chunk of page) {
        expect(chunk.length).toBeLessThanOrEqual(12)
      }
    }
    // ...and no words are lost or reordered.
    expect(pages.flat().join(" ")).toBe(long)
  })
})
