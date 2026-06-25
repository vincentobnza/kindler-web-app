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

/** A book's reflowed full text, ready to paginate. */
export interface BookText {
  /** Clean, reflowed paragraphs (hard OCR line wraps already joined). */
  paragraphs: string[]
  source: BookTextSource
}
