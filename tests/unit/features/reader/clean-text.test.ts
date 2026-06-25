import { describe, expect, it } from "vitest"

import {
  cleanBookText,
  stripGutenbergBoilerplate,
} from "@/features/reader/lib/clean-text"

// Typographic results, by code point, so this test file stays ASCII-clean.
const LDQUO = String.fromCharCode(0x201c)
const RDQUO = String.fromCharCode(0x201d)
const RSQUO = String.fromCharCode(0x2019)
const MDASH = String.fromCharCode(0x2014)
const HELLIP = String.fromCharCode(0x2026)

const paragraph = (
  text: string,
  extra?: { opensSection?: boolean; dropCap?: boolean }
) => ({
  kind: "paragraph",
  text,
  opensSection: extra?.opensSection ?? false,
  dropCap: extra?.dropCap ?? false,
})

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
  it("reflows hard-wrapped lines into a single paragraph block", () => {
    const raw = "It is a truth\nuniversally acknowledged,\nthat a single man."
    expect(cleanBookText(raw)).toEqual([
      paragraph("It is a truth universally acknowledged, that a single man."),
    ])
  })

  it("splits paragraphs on blank lines", () => {
    const raw = "First paragraph\nwrapped.\n\nSecond paragraph."
    expect(cleanBookText(raw)).toEqual([
      paragraph("First paragraph wrapped."),
      paragraph("Second paragraph."),
    ])
  })

  it("de-hyphenates words broken across a line wrap", () => {
    const raw = "the estab-\nlishment of the household"
    expect(cleanBookText(raw)).toEqual([
      paragraph("the establishment of the household"),
    ])
  })

  it("treats form-feed page breaks as paragraph boundaries", () => {
    const raw = "End of page one.\fStart of page two."
    expect(cleanBookText(raw)).toEqual([
      paragraph("End of page one."),
      paragraph("Start of page two."),
    ])
  })

  it("drops empty blocks and collapses whitespace", () => {
    const raw = "Spaced    out\n\n\n\n   text   here   "
    expect(cleanBookText(raw)).toEqual([
      paragraph("Spaced out"),
      paragraph("text here"),
    ])
  })

  it("drops bare page numbers left in the scan", () => {
    const raw = "Real text here.\n\n42\n\nMore real text."
    expect(cleanBookText(raw)).toEqual([
      paragraph("Real text here."),
      paragraph("More real text."),
    ])
  })

  it("lifts a chapter label and its title into one heading, opening the chapter", () => {
    const raw =
      "CHAPTER I.\n\nDown the Rabbit-Hole\n\nAlice was beginning to get very tired."
    expect(cleanBookText(raw)).toEqual([
      { kind: "heading", title: "Down the Rabbit-Hole", kicker: "Chapter I" },
      paragraph("Alice was beginning to get very tired.", {
        opensSection: true,
        dropCap: true,
      }),
    ])
  })

  it("recognises an all-caps line as a heading (no kicker)", () => {
    expect(cleanBookText("THE END")).toEqual([
      { kind: "heading", title: "THE END" },
    ])
  })

  it("turns a star divider into a scene break and opens the next section", () => {
    const raw = "He left.\n\n* * *\n\nYears passed."
    expect(cleanBookText(raw)).toEqual([
      paragraph("He left."),
      { kind: "break" },
      paragraph("Years passed.", { opensSection: true }),
    ])
  })

  it("applies book typography: curly quotes, em dashes, ellipses, no underscores", () => {
    const raw = 'He said, "Wait--I think... it is _mine_."'
    expect(cleanBookText(raw)).toEqual([
      paragraph(
        `He said, ${LDQUO}Wait${MDASH}I think${HELLIP} it is mine.${RDQUO}`
      ),
    ])
  })

  it("curls apostrophes in contractions and possessives", () => {
    expect(cleanBookText("It's a dog's life.")).toEqual([
      paragraph(`It${RSQUO}s a dog${RSQUO}s life.`),
    ])
  })
})
