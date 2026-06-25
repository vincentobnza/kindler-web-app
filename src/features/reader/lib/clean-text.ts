/**
 * Turns a raw text dump (OCR `*_djvu.txt` or a Project Gutenberg `.txt`) into
 * clean, reflowed paragraphs suitable for on-screen reading.
 *
 * Source text is hard-wrapped at a fixed column and littered with page-break
 * artefacts; rendering it verbatim looks like a code listing, not a book. We
 * strip the licence boilerplate, then join hard line wraps back into flowing
 * paragraphs so the browser can re-wrap them to any width. Pure + synchronous,
 * so it is trivially unit-testable.
 */

const GUTENBERG_START =
  /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i
const GUTENBERG_END =
  /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i

// Built from escapes (not literals) to keep this source file ASCII-clean, the
// same way lib/format/text.ts handles combining marks.
const BYTE_ORDER_MARK = new RegExp("^\\uFEFF")
const NON_BREAKING_SPACE = new RegExp("\\u00A0", "g")

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

/** Joins one block's hard-wrapped lines into a single flowing paragraph. */
function reflowParagraph(block: string): string {
  return block
    .replace(/([a-z])-\n([a-z])/g, "$1$2") // de-hyphenate word breaks
    .replace(/\n+/g, " ") // hard wraps -> spaces
    .replace(/[ \t]+/g, " ") // collapse whitespace runs
    .trim()
}

/**
 * Normalises and reflows raw book text into display paragraphs. Blank lines
 * delimit paragraphs; everything within a paragraph is re-joined.
 */
export function cleanBookText(raw: string): string[] {
  const normalized = raw
    .replace(BYTE_ORDER_MARK, "") // strip BOM
    .replace(/\r\n?/g, "\n") // CRLF / CR -> LF
    .replace(/\f/g, "\n\n") // form-feed page breaks -> paragraph break
    .replace(NON_BREAKING_SPACE, " ") // non-breaking space -> regular space

  return stripGutenbergBoilerplate(normalized)
    .split(/\n[ \t]*\n+/) // one or more blank lines = paragraph boundary
    .map(reflowParagraph)
    .filter((paragraph) => paragraph.length > 0)
}
