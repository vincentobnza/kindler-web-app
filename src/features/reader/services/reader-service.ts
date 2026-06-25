/**
 * Resolves a work's readable full text for the in-app reader.
 *
 * Open Library has no "give me the text" endpoint, so we assemble it from the
 * pieces it does expose:
 *
 *  1. Look the work up in the search index — its doc carries the *complete*
 *     list of Internet Archive ids (`ia`), including public Project Gutenberg
 *     items, plus an `ebook_access` flag. (The work record and the first page
 *     of editions both miss the Gutenberg ids, so search is the reliable source.)
 *  2. Rank candidates (Gutenberg = cleanest text; sale listings / audio last)
 *     and probe each IA item: skip access-restricted ones (they serve a stub,
 *     not the book), pick the best text file, download and clean it.
 *
 * The first candidate yielding enough real text wins. All endpoints send
 * `Access-Control-Allow-Origin: *`, so this runs entirely in the browser.
 */

import { API_ENDPOINTS } from "@/constants/api-endpoints"
import {
  READER_MAX_TEXT_BYTES,
  READER_MAX_TEXT_CANDIDATES,
  READER_MIN_TEXT_CHARS,
} from "@/constants/app-config"
import { apiClient } from "@/lib/http/api-client"
import { ApiError } from "@/lib/http/api-error"

import { ARCHIVE } from "../constants"
import { cleanBookText } from "../lib/clean-text"
import type { BookText, BookTextSource } from "../types"

interface WorkSearchResponse {
  docs?: Array<{ ia?: string[]; ebook_access?: string }>
}

interface EditionsResponse {
  entries?: Array<{ ocaid?: string }>
}

interface ArchiveFile {
  name: string
  format?: string
  size?: string
}

interface ArchiveMetadataResponse {
  files?: ArchiveFile[]
  metadata?: { "access-restricted-item"?: string | boolean }
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

/** Lower rank = tried first. Gutenberg = clean text; listings/audio = no text. */
function rankIaId(id: string): number {
  const lower = id.toLowerCase()
  if (lower.startsWith("bwb_") || lower.includes("librivox")) return 3
  if (/gutenberg|gut$/.test(lower)) return 0
  return 1
}

function rankAndLimit(ids: Iterable<string>): string[] {
  return [...new Set(ids)]
    .sort((a, b) => rankIaId(a) - rankIaId(b))
    .slice(0, READER_MAX_TEXT_CANDIDATES)
}

/**
 * Ordered, de-duplicated IA item ids worth probing for full text. Prefers the
 * search index (complete list) and falls back to the work's editions.
 */
async function resolveCandidates(
  bookId: string,
  signal?: AbortSignal
): Promise<string[]> {
  try {
    const search = await apiClient.get<WorkSearchResponse>(
      API_ENDPOINTS.workSearch(bookId),
      signal
    )
    const doc = search.docs?.[0]
    if (doc) {
      if (doc.ebook_access === "no_ebook") return []
      if (doc.ia && doc.ia.length > 0) return rankAndLimit(doc.ia)
    }
  } catch (error) {
    if (isAbort(error)) throw error
    // Search unavailable — fall through to the editions fallback below.
  }

  const editions = await apiClient.get<EditionsResponse>(
    API_ENDPOINTS.editions(bookId),
    signal
  )
  const ocaids = (editions.entries ?? [])
    .map((entry) => entry.ocaid)
    .filter((ocaid): ocaid is string => Boolean(ocaid))
  return rankAndLimit(ocaids)
}

/** Internet Archive serves a stub (not the book) for borrow-only items. */
function isRestricted(metadata: ArchiveMetadataResponse): boolean {
  return String(metadata.metadata?.["access-restricted-item"]) === "true"
}

/** Picks the best readable text file from an IA item, if any. */
function chooseTextFile(files: ArchiveFile[]): ArchiveFile | undefined {
  const candidates = files.filter((file) => {
    const name = file.name.toLowerCase()
    const size = Number(file.size ?? 0)
    if (size > READER_MAX_TEXT_BYTES) return false
    return (
      name.endsWith(".txt") &&
      (file.format === "DjVuTXT" ||
        file.format === "Text" ||
        name.endsWith("_djvu.txt"))
    )
  })

  // Prefer the canonical `_djvu.txt`, then the largest (most complete) text.
  candidates.sort((a, b) => {
    const aDjvu = a.name.toLowerCase().endsWith("_djvu.txt") ? 1 : 0
    const bDjvu = b.name.toLowerCase().endsWith("_djvu.txt") ? 1 : 0
    if (aDjvu !== bDjvu) return bDjvu - aDjvu
    return Number(b.size ?? 0) - Number(a.size ?? 0)
  })
  return candidates[0]
}

/** Raw text fetch — the JSON-only {@link apiClient} can't be reused here. */
async function fetchText(url: string, signal?: AbortSignal): Promise<string> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbort(error)) throw error
    throw new ApiError("Unable to reach the full-text source.", 0)
  }
  if (!response.ok) {
    throw new ApiError(
      `Full-text request failed with status ${response.status}`,
      response.status
    )
  }
  return response.text()
}

function describeSource(ocaid: string): BookTextSource {
  const provider = /gutenberg|gut$/i.test(ocaid)
    ? "Project Gutenberg"
    : "Internet Archive"
  return { ocaid, provider, url: `https://archive.org/details/${ocaid}` }
}

/** Reads clean full text from one IA item, or null if it isn't usable. */
async function readFromItem(
  ocaid: string,
  signal?: AbortSignal
): Promise<BookText | null> {
  const metadata = await apiClient.get<ArchiveMetadataResponse>(
    ARCHIVE.metadata(ocaid),
    signal
  )
  if (isRestricted(metadata)) return null

  const file = chooseTextFile(metadata.files ?? [])
  if (!file) return null

  const raw = await fetchText(ARCHIVE.file(ocaid, file.name), signal)
  const blocks = cleanBookText(raw)

  const length = blocks.reduce((total, block) => {
    if (block.kind === "break") return total
    return total + (block.kind === "heading" ? block.title : block.text).length
  }, 0)
  if (length < READER_MIN_TEXT_CHARS) return null

  return { blocks, source: describeSource(ocaid) }
}

export const readerService = {
  /**
   * Resolves a work's readable full text, or throws an {@link ApiError} (404)
   * when no edition exposes usable text. Aborts propagate; per-candidate
   * failures are swallowed so one bad item doesn't sink the whole lookup.
   */
  getBookText: async (
    bookId: string,
    signal?: AbortSignal
  ): Promise<BookText> => {
    const candidates = await resolveCandidates(bookId, signal)

    for (const ocaid of candidates) {
      try {
        const text = await readFromItem(ocaid, signal)
        if (text) return text
      } catch (error) {
        if (isAbort(error)) throw error
        // Otherwise this candidate is unreadable — move on to the next.
      }
    }

    throw new ApiError("No readable full text is available for this book.", 404)
  },
}
