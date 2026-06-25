/**
 * Internet Archive endpoints used by the reader. Open Library exposes full-text
 * scans only via an edition's `ocaid`, which resolves to an IA item; the actual
 * book text lives in that item's files (a `*_djvu.txt` OCR dump for scans, or a
 * plain `*.txt` for Project Gutenberg sources).
 *
 * Both endpoints send `Access-Control-Allow-Origin: *`, so the browser can call
 * them directly — no backend or proxy required.
 */

const ARCHIVE_BASE_URL = "https://archive.org"

export const ARCHIVE = {
  /** Item metadata (JSON), including its file list. */
  metadata: (ocaid: string): string =>
    `${ARCHIVE_BASE_URL}/metadata/${encodeURIComponent(ocaid)}`,
  /** Direct download URL for a named file inside an item. */
  file: (ocaid: string, fileName: string): string =>
    `${ARCHIVE_BASE_URL}/download/${encodeURIComponent(ocaid)}/${encodeURIComponent(fileName)}`,
} as const
