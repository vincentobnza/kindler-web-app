/**
 * Splits a book's blocks into fixed-ish "sections" for the reader. A section is
 * just a virtualization chunk targeting roughly `charsPerSection` characters;
 * the scroll reads as one continuous column. Blocks are never split across
 * sections (so a heading never parts from its first line) unless a single
 * paragraph is itself larger than a section, in which case it is chunked on word
 * boundaries. Pure -> unit-testable, and deterministic so a reader's saved
 * section index stays valid across reloads.
 */

import type { BookBlock } from "../types"

/** Rough render "cost" of a block, used only to balance section sizes. */
function blockWeight(block: BookBlock): number {
  if (block.kind === "paragraph") return block.text.length
  if (block.kind === "heading")
    return (block.kicker?.length ?? 0) + block.title.length + 24
  return 24 // a scene break still occupies vertical space
}

/** Splits one over-long paragraph into paragraph blocks no larger than `max`. */
function splitLongParagraph(
  block: BookBlock & { kind: "paragraph" },
  max: number
): BookBlock[] {
  const words = block.text.split(" ")
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

  // Only the first chunk keeps the opener treatment (flush-left + drop cap).
  return chunks.map((text, index) => ({
    kind: "paragraph",
    text,
    opensSection: index === 0 ? block.opensSection : false,
    dropCap: index === 0 ? block.dropCap : false,
  }))
}

/**
 * Groups blocks into sections, each targeting roughly `charsPerSection`
 * characters. Always returns at least one (possibly empty) section.
 */
export function paginate(
  blocks: BookBlock[],
  charsPerSection: number
): BookBlock[][] {
  const sections: BookBlock[][] = []
  let current: BookBlock[] = []
  let length = 0

  const flush = () => {
    if (current.length > 0) {
      sections.push(current)
      current = []
      length = 0
    }
  }

  for (const block of blocks) {
    const pieces =
      block.kind === "paragraph" && block.text.length > charsPerSection
        ? splitLongParagraph(block, charsPerSection)
        : [block]

    for (const piece of pieces) {
      const weight = blockWeight(piece)
      // Break to a new section when this piece would overflow a non-empty one.
      if (length > 0 && length + weight > charsPerSection) flush()
      current.push(piece)
      length += weight
    }
  }
  flush()

  return sections.length > 0 ? sections : [[]]
}
