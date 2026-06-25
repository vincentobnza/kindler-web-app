/** Tunable, magic-number-free application constants. */

/** TanStack Query: how long fetched data is considered fresh (5 min). */
export const QUERY_STALE_TIME_MS = 1000 * 60 * 5

/** TanStack Query: how long unused cache entries are retained (30 min). */
export const QUERY_GC_TIME_MS = 1000 * 60 * 30

/** Default retry count for queries (4xx responses are never retried). */
export const QUERY_RETRY_COUNT = 2

/** Books requested per search request/page. */
export const SEARCH_PAGE_SIZE = 24

/** Books requested per discover subject shelf. */
export const SHELF_SIZE = 16

/** Number of skeleton placeholders shown while a grid loads. */
export const SKELETON_GRID_COUNT = 12

/** Debounce applied to the live search input, in milliseconds. */
export const INPUT_DEBOUNCE_MS = 350

/** Minimum query length before a search is fired. */
export const SEARCH_MIN_QUERY_LENGTH = 2

/**
 * Reader: target characters per virtualized "section". The reader renders the
 * whole book as one continuous scroll; the text is chunked into sections of
 * roughly this size so each block can be skipped by `content-visibility` while
 * off-screen. The chunker never splits a paragraph.
 */
export const READER_CHARS_PER_SECTION = 1800

/**
 * Reader: how many candidate editions (Internet Archive `ocaid`s) to probe for
 * a readable text file before giving up. Bounds the number of network round
 * trips when resolving a work's full text.
 */
export const READER_MAX_TEXT_CANDIDATES = 8

/** Reader: largest text file to download, in bytes (guards against huge OCR dumps). */
export const READER_MAX_TEXT_BYTES = 8 * 1024 * 1024

/**
 * Reader: minimum cleaned text length to accept a candidate. Access-restricted
 * Internet Archive items serve a tiny "not available" stub instead of the book;
 * this floor rejects those (and other empty scans) so we fall through to a
 * readable edition.
 */
export const READER_MIN_TEXT_CHARS = 600

/** Reader: font-size scale bounds and step for the A−/A+ controls. */
export const READER_FONT_SCALE = {
  min: 0.85,
  max: 1.6,
  step: 0.15,
  default: 1,
} as const
