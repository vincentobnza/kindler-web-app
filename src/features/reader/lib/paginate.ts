/**
 * Splits reflowed paragraphs into fixed-ish "pages" for the reader. Paragraphs
 * are never split across pages (so a sentence never breaks mid-page) unless a
 * single paragraph is itself larger than a page, in which case it is chunked on
 * word boundaries. Pure → unit-testable, and deterministic so a reader's saved
 * page index stays valid across reloads.
 */

/** Splits one over-long paragraph into chunks no larger than `max` chars. */
function splitLongParagraph(paragraph: string, max: number): string[] {
  const words = paragraph.split(" ")
  const chunks: string[] = []
  let buffer = ""

  for (const word of words) {
    if (buffer && buffer.length + 1 + word.length > max) {
      chunks.push(buffer)
      buffer = word
    } else {
      buffer = buffer ? `${buffer} ${word}` : word
    }
  }
  if (buffer) chunks.push(buffer)
  return chunks
}

/**
 * Groups paragraphs into pages, each targeting roughly `charsPerPage`
 * characters. Always returns at least one (possibly empty) page.
 */
export function paginate(
  paragraphs: string[],
  charsPerPage: number
): string[][] {
  const pages: string[][] = []
  let current: string[] = []
  let length = 0

  const flush = () => {
    if (current.length > 0) {
      pages.push(current)
      current = []
      length = 0
    }
  }

  for (const paragraph of paragraphs) {
    const chunks =
      paragraph.length > charsPerPage
        ? splitLongParagraph(paragraph, charsPerPage)
        : [paragraph]

    for (const chunk of chunks) {
      // Break to a new page when this chunk would overflow a non-empty page.
      if (length > 0 && length + chunk.length > charsPerPage) flush()
      current.push(chunk)
      length += chunk.length
    }
  }
  flush()

  return pages.length > 0 ? pages : [[]]
}
