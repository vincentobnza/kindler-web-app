import { describe, expect, it } from "vitest"

import { getInitials, normalizeForSearch, truncate } from "@/lib/format/text"

describe("getInitials", () => {
  it("returns two initials for a full name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL")
  })

  it("uses first and last for three+ word names", () => {
    expect(getInitials("Grace Brewster Hopper")).toBe("GH")
  })

  it("returns up to two letters for a single word", () => {
    expect(getInitials("Linus")).toBe("LI")
  })

  it("falls back to '?' for empty input", () => {
    expect(getInitials("   ")).toBe("?")
  })
})

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("short", 10)).toBe("short")
  })

  it("appends an ellipsis when shortened", () => {
    expect(truncate("abcdef", 4)).toBe("abc…")
  })
})

describe("normalizeForSearch", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalizeForSearch("José")).toBe("jose")
  })

  it("trims surrounding whitespace", () => {
    expect(normalizeForSearch("  Hello ")).toBe("hello")
  })
})
