/** Namespaced localStorage keys for all persisted client state. */

export const STORAGE_KEYS = {
  library: "kindler:library",
  /** Per-book reading position (current page), so the reader can resume. */
  readingProgress: "kindler:reading-progress",
} as const
