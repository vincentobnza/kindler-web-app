/** Reader domain types. */

/** Where a resolved full text came from, for attribution in the UI. */
export interface BookTextSource {
  /** Internet Archive item id the text was read from. */
  ocaid: string
  /** Human label, e.g. "Internet Archive" / "Project Gutenberg". */
  provider: string
  /** Canonical URL of the source item, for a "view source" link. */
  url: string
}

/**
 * One renderable unit of a book. The raw text dump is parsed into a stream of
 * these so the reader can lay it out like a real book — chapter headings set
 * apart from the prose, scene breaks shown as an ornament, and flowing
 * paragraphs that the renderer re-wraps to any width.
 */
export type BookBlock =
  | {
      kind: "heading"
      /** The heading line itself (a chapter title or section name). */
      title: string
      /** Optional small-caps lead-in, e.g. "Chapter IV" above the title. */
      kicker?: string
    }
  | {
      kind: "paragraph"
      /** Clean, reflowed prose (hard line wraps already joined). */
      text: string
      /** First paragraph of a chapter / after a scene break: set flush-left. */
      opensSection?: boolean
      /** First paragraph of a chapter: render an opening drop cap. */
      dropCap?: boolean
    }
  | {
      /** A scene break between sections, rendered as a centered ornament. */
      kind: "break"
    }

/** A book's parsed full text, ready to paginate. */
export interface BookText {
  /** Structured, display-ready blocks in reading order. */
  blocks: BookBlock[]
  source: BookTextSource
}
