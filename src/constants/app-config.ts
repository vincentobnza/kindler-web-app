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
