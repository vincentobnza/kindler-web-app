import { describe, expect, it } from "vitest"

import {
  cleanBookText,
  stripGutenbergBoilerplate,
} from "@/features/reader/lib/clean-text"

describe("stripGutenbergBoilerplate", () => {
  it("keeps only the text between the START and END markers", () => {
    const raw = [
      "Licence header, lots of legalese.",
      "*** START OF THE PROJECT GUTENBERG EBOOK PRIDE AND PREJUDICE ***",
      "The real book.",
      "*** END OF THE PROJECT GUTENBERG EBOOK PRIDE AND PREJUDICE ***",
      "Footer with more legalese.",
    ].join("\n")

    expect(stripGutenbergBoilerplate(raw).trim()).toBe("The real book.")
  })

  it("returns the text unchanged when no markers are present", () => {
    const raw = "An OCR scan with no Gutenberg markers."
    expect(stripGutenbergBoilerplate(raw)).toBe(raw)
  })
})

describe("cleanBookText", () => {
  it("reflows hard-wrapped lines into a single paragraph", () => {
    const raw = "It is a truth\nuniversally acknowledged,\nthat a single man."
    expect(cleanBookText(raw)).toEqual([
      "It is a truth universally acknowledged, that a single man.",
    ])
  })

  it("splits paragraphs on blank lines", () => {
    const raw = "First paragraph\nwrapped.\n\nSecond paragraph."
    expect(cleanBookText(raw)).toEqual([
      "First paragraph wrapped.",
      "Second paragraph.",
    ])
  })

  it("de-hyphenates words broken across a line wrap", () => {
    const raw = "the estab-\nlishment of the household"
    expect(cleanBookText(raw)).toEqual(["the establishment of the household"])
  })

  it("treats form-feed page breaks as paragraph boundaries", () => {
    const raw = "End of page one.\fStart of page two."
    expect(cleanBookText(raw)).toEqual([
      "End of page one.",
      "Start of page two.",
    ])
  })

  it("drops empty blocks and collapses whitespace", () => {
    const raw = "Spaced    out\n\n\n\n   text   here   "
    expect(cleanBookText(raw)).toEqual(["Spaced out", "text here"])
  })
})
