/**
 * Turns a raw text dump (an OCR `*_djvu.txt` scan or a Project Gutenberg `.txt`)
 * into a clean, structured stream of {@link BookBlock}s ready to render like a
 * real book.
 *
 * These dumps are messy: hard-wrapped at a fixed column, sprinkled with page
 * numbers and running heads, scene breaks written as bare asterisks, italics
 * marked with `_underscores_`, and straight typewriter quotes/dashes. Rendered
 * verbatim they read like a code listing, not a book. So we:
 *
 *   1. normalise line endings and strip the Project Gutenberg licence wrapper,
 *   2. split on blank lines into blocks and reflow each into one flowing line,
 *   3. classify every block - chapter heading, scene break, drop junk - and
 *   4. polish the surviving prose with proper book typography (curly quotes,
 *      em dashes, ellipses).
 *
 * Pure + synchronous, so the whole pipeline is trivially unit-testable.
 */

import type { BookBlock } from "../types"

const GUTENBERG_START =
  /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
const GUTENBERG_END =
  /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i

// Built from escapes (not literals) to keep this source file ASCII-clean, the
// same way lib/format/text.ts handles combining marks.
const BYTE_ORDER_MARK = new RegExp("^\\uFEFF")
const NON_BREAKING_SPACE = new RegExp("\\u00A0", "g")

// Typographic characters, by code point, for the same reason.
const LEFT_DOUBLE = String.fromCharCode(0x201c)
const RIGHT_DOUBLE = String.fromCharCode(0x201d)
const LEFT_SINGLE = String.fromCharCode(0x2018)
const RIGHT_SINGLE = String.fromCharCode(0x2019)
const EM_DASH = String.fromCharCode(0x2014)
const ELLIPSIS = String.fromCharCode(0x2026)

/**
 * Drops Project Gutenberg's legal header/footer, keeping only the work itself.
 * Returns the input unchanged when the markers aren't present (e.g. OCR scans).
 */
export function stripGutenbergBoilerplate(text: string): string {
  const start = GUTENBERG_START.exec(text)
  const end = GUTENBERG_END.exec(text)
  const from = start ? start.index + start[0].length : 0
  const to = end ? end.index : text.length
  if (to <= from) return text
  return text.slice(from, to)
}

/** Joins one block's hard-wrapped lines into a single flowing line. */
function reflow(block: string): string {
  return block
    .replace(/([A-Za-z])-\n[ \t]*([A-Za-z])/g, "$1$2") // de-hyphenate word breaks
    .replace(/\n+/g, " ") // hard wraps -> spaces
    .replace(/[ \t]+/g, " ") // collapse whitespace runs
    .trim()
}

/** Turns straight typewriter quotes into balanced curly quotes. */
function curlQuotes(text: string): string {
  return (
    text
      // Opening double quote: at the start, or after a space / bracket / dash.
      .replace(new RegExp(`(^|[\\s([{${EM_DASH}])"`, "g"), `$1${LEFT_DOUBLE}`)
      .replace(/"/g, RIGHT_DOUBLE) // any remaining double quote closes
      // Apostrophes inside words (contractions, possessives).
      .replace(/([A-Za-z])'([A-Za-z])/g, `$1${RIGHT_SINGLE}$2`)
      // Opening single quote: at the start, or after a space / bracket / dash.
      .replace(new RegExp(`(^|[\\s([{${EM_DASH}])'`, "g"), `$1${LEFT_SINGLE}`)
      .replace(/'/g, RIGHT_SINGLE) // remaining single quotes close
  )
}

/** Applies book typography to one reflowed line of prose or a heading. */
function prettify(text: string): string {
  return curlQuotes(
    text
      .replace(/\[Illustration[^\]]*\]/gi, "") // drop inline illustration captions
      .replace(/_/g, "") // Project Gutenberg italics markers
      .replace(/-{2,}/g, EM_DASH) // -- / --- -> em dash
      .replace(/\.\s?\.\s?\./g, ELLIPSIS) // ... or . . . -> ellipsis
  )
    .replace(/\s{2,}/g, " ")
    .trim()
}

// A scene break written as stars / bullets / a rule line, ignoring spaces.
const SCENE_BREAK = new RegExp(
  "^(?:\\*+|\\u2022+|\\u00B7+|[-\\u2013\\u2014_=~]+)$"
)

/** A scene-break ornament: a short run of stars / bullets / a rule line. */
function isSceneBreak(line: string): boolean {
  const compact = line.replace(/\s+/g, "")
  return compact.length >= 3 && SCENE_BREAK.test(compact)
}

/** Page numbers, transcriber notes and other dump cruft worth discarding. */
function isJunk(line: string): boolean {
  if (!/[A-Za-z0-9]/.test(line)) return true // stray punctuation / rules
  if (/^\d{1,4}$/.test(line)) return true // bare page number
  return /^(produced by|this (?:e-?book|etext|file) (?:is|was)\b|transcriber|end of (?:the |this )?project gutenberg|start of (?:the |this )?project gutenberg|project gutenberg|\[illustration[^\]]*\]$|\*\*\*)/i.test(
    line
  )
}

/** Title-cases a single label word, e.g. "CHAPTER" / "part" -> "Chapter". */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

interface Heading {
  kicker?: string
  title: string
  /** A bare label/number with no inline title - a sibling line may follow. */
  labelOnly: boolean
}

const SECTION_WORD = new RegExp(
  "^(prologue|epilogue|introduction|preface|foreword|afterword|appendix|conclusion|dedication)\\b[.):\\u2014\\u2013\\s-]*(.*)$",
  "i"
)
const LABEL_WORD =
  /^(chapter|chap|part|book|volume|vol|canto|section|stave|letter)\s+(.*)$/i
const LABEL_NUMBER = new RegExp(
  "^(\\d{1,4}|[IVXLCDM]{1,7}|[A-Z][A-Za-z]*)\\b[.):\\u2014\\u2013\\s-]*(.*)$"
)

/**
 * Recognises chapter/section headings. Returns the parsed heading or null for
 * ordinary prose. Kept conservative - short, standalone, heading-shaped lines
 * only - so body text is never mistaken for a title.
 */
function parseHeading(line: string): Heading | null {
  if (line.length > 80) return null
  if (line.split(/\s+/).length > 12) return null

  // Bare uppercase roman numeral chapter marker, e.g. "IV." / "XII".
  if (/^[IVXLCDM]{1,7}\.?$/.test(line)) {
    return { title: line.replace(/\.$/, ""), labelOnly: true }
  }

  // Standalone section words: "Prologue", "Appendix B", ...
  const section = SECTION_WORD.exec(line)
  if (section) {
    const kicker = capitalize(section[1])
    const rest = section[2].trim()
    return rest
      ? { kicker, title: rest, labelOnly: false }
      : { title: kicker, labelOnly: true }
  }

  // Labelled chapter heading: "Chapter 4 - The Storm", "Book II", "PART ONE".
  const labelled = LABEL_WORD.exec(line)
  if (labelled) {
    const number = LABEL_NUMBER.exec(labelled[2])
    if (number) {
      const kicker = `${capitalize(labelled[1])} ${number[1]}`.trim()
      const rest = number[2].trim()
      return rest
        ? { kicker, title: rest, labelOnly: false }
        : { title: kicker, labelOnly: true }
    }
  }

  // An all-caps standalone line - a title or section marker ("THE END").
  if (
    line.split(/\s+/).length <= 9 &&
    /[A-Za-z]/.test(line) &&
    /[A-Z]/.test(line) &&
    !/[a-z]/.test(line)
  ) {
    return { title: line, labelOnly: false }
  }

  return null
}

// A line that starts like a title: a letter or an opening quote/bracket.
const TITLE_START = new RegExp("^[A-Za-z\"'(\\u201C\\u2018]")

/** A short, title-shaped line that belongs with the heading just above it. */
function isSubtitle(line: string): boolean {
  if (!line || line.length > 56) return false
  if (line.split(/\s+/).length > 9) return false
  if (isSceneBreak(line) || isJunk(line) || parseHeading(line)) return false
  if (!TITLE_START.test(line)) return false
  return !/[,;:]$/.test(line) // not a dangling clause
}

/**
 * Parses raw book text into display-ready blocks. Blank lines delimit blocks;
 * each is reflowed, then classified as a heading, scene break or paragraph,
 * with dump cruft dropped along the way.
 */
export function cleanBookText(raw: string): BookBlock[] {
  const normalized = raw
    .replace(BYTE_ORDER_MARK, "") // strip BOM
    .replace(/\r\n?/g, "\n") // CRLF / CR -> LF
    .replace(/\f/g, "\n\n") // form-feed page breaks -> paragraph break
    .replace(NON_BREAKING_SPACE, " ") // non-breaking space -> regular space

  const lines = stripGutenbergBoilerplate(normalized)
    .split(/\n[ \t]*\n+/) // one or more blank lines = block boundary
    .map(reflow)

  const blocks: BookBlock[] = []
  let prev: BookBlock["kind"] | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Scene breaks are punctuation-only, so test them before the junk filter
    // (which would otherwise discard them as stray symbols).
    if (isSceneBreak(line)) {
      // No leading break, and never one right after a heading or another break.
      if (prev === null || prev === "break" || prev === "heading") continue
      blocks.push({ kind: "break" })
      prev = "break"
      continue
    }

    if (isJunk(line)) continue

    const heading = parseHeading(line)
    if (heading) {
      let { kicker, title } = heading
      // A bare label ("Chapter IV") often sits above its title on the next
      // line - pull that line up so they render as one heading.
      if (heading.labelOnly && !kicker) {
        const next = lines[i + 1] ? reflow(lines[i + 1]) : ""
        if (isSubtitle(next)) {
          kicker = title
          title = next
          i++ // consume the title line
        }
      }
      blocks.push({
        kind: "heading",
        title: prettify(title),
        ...(kicker ? { kicker: prettify(kicker) } : {}),
      })
      prev = "heading"
      continue
    }

    blocks.push({
      kind: "paragraph",
      text: prettify(line),
      opensSection: prev === "heading" || prev === "break",
      dropCap: prev === "heading",
    })
    prev = "paragraph"
  }

  return blocks
}
