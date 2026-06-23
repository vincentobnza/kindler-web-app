import { describe, expect, it } from "vitest"

import { bookCoverUrl, formatAuthors, formatRating } from "@/lib/format/book"

describe("bookCoverUrl", () => {
  it("prefers the numeric cover id", () => {
    expect(bookCoverUrl({ coverId: 123 }, "L")).toContain("/b/id/123-L.jpg")
  })

  it("falls back to the edition OLID", () => {
    expect(bookCoverUrl({ coverEdition: "OL1M" })).toContain(
      "/b/olid/OL1M-M.jpg"
    )
  })

  it("returns undefined when there is no cover", () => {
    expect(bookCoverUrl({})).toBeUndefined()
  })
})

describe("formatAuthors", () => {
  it("falls back when there are no authors", () => {
    expect(formatAuthors([])).toBe("Unknown author")
  })

  it("joins a short list", () => {
    expect(formatAuthors(["Ada", "Grace"])).toBe("Ada, Grace")
  })

  it("collapses long lists with a +N suffix", () => {
    expect(formatAuthors(["A", "B", "C", "D"], 2)).toBe("A, B +2")
  })
})

describe("formatRating", () => {
  it("formats to one decimal place", () => {
    expect(formatRating(4.307)).toBe("4.3")
  })

  it("returns null when unrated", () => {
    expect(formatRating(undefined)).toBeNull()
  })
})
