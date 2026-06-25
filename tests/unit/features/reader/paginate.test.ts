import { describe, expect, it } from "vitest"

import { paginate } from "@/features/reader/lib/paginate"
import type { BookBlock } from "@/features/reader/types"

const para = (text: string, extra?: Partial<BookBlock>): BookBlock => ({
  kind: "paragraph",
  text,
  opensSection: false,
  dropCap: false,
  ...extra,
})

const texts = (sections: BookBlock[][]): string[] =>
  sections.flat().map((block) => (block.kind === "paragraph" ? block.text : ""))

describe("paginate", () => {
  it("always returns at least one section, even when empty", () => {
    expect(paginate([], 100)).toEqual([[]])
  })

  it("keeps blocks that fit together in the same section", () => {
    const blocks = [para("aaaa"), para("bbbb")]
    expect(paginate(blocks, 100)).toEqual([blocks])
  })

  it("starts a new section when the next block would overflow", () => {
    // budget 10: "aaaaa" (5) fits; adding "bbbbbb" (6) -> 11 > 10, so it breaks.
    const pages = paginate([para("aaaaa"), para("bbbbbb")], 10)
    expect(pages).toEqual([[para("aaaaa")], [para("bbbbbb")]])
  })

  it("never splits a paragraph that fits within the budget", () => {
    const blocks = [para("one"), para("two"), para("three"), para("four")]
    const pages = paginate(blocks, 8)
    for (const page of pages) {
      expect(page.length).toBeGreaterThan(0)
    }
    expect(texts(pages)).toEqual(["one", "two", "three", "four"])
  })

  it("chunks an over-long paragraph on word boundaries", () => {
    const long = "alpha beta gamma delta epsilon"
    const pages = paginate([para(long)], 12)
    for (const page of pages) {
      for (const block of page) {
        if (block.kind === "paragraph") {
          expect(block.text.length).toBeLessThanOrEqual(12)
        }
      }
    }
    // ...and no words are lost or reordered.
    expect(texts(pages).join(" ")).toBe(long)
  })

  it("keeps only the first chunk of a split opener as the chapter opening", () => {
    const long = "alpha beta gamma delta epsilon zeta eta theta"
    const opener = para(long, { opensSection: true, dropCap: true })
    const openers = paginate([opener], 12)
      .flat()
      .filter((b) => b.kind === "paragraph" && b.dropCap)
    expect(openers).toHaveLength(1)
  })

  it("preserves headings and scene breaks as their own blocks", () => {
    const blocks: BookBlock[] = [
      { kind: "heading", title: "Chapter One" },
      para("Body."),
      { kind: "break" },
      para("More body.", { opensSection: true }),
    ]
    expect(paginate(blocks, 1000)).toEqual([blocks])
  })
})
