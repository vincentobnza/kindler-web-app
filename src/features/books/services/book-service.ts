/** Books domain data access. The only layer that knows endpoint shapes. */

import { ENV } from "@/config/env"
import { API_ENDPOINTS, type SearchParams } from "@/constants/api-endpoints"
import type {
  AuthorResponse,
  Book,
  BookDetail,
  SearchDoc,
  SearchResponse,
  SubjectResponse,
  SubjectWork,
  WorkDetailResponse,
} from "@/types/book"
import { apiClient } from "@/lib/http/api-client"

export interface SearchResult {
  books: Book[]
  total: number
}

/** Strips Open Library's `/works/` (or `/books/`) prefix from a key. */
function workIdFromKey(key: string): string {
  return key.replace(/^\/(?:works|books)\//, "")
}

function docToBook(doc: SearchDoc): Book {
  return {
    id: workIdFromKey(doc.key),
    title: doc.title,
    authors: doc.author_name ?? [],
    coverId: doc.cover_i,
    coverEdition: doc.cover_edition_key,
    firstPublishYear: doc.first_publish_year,
    editionCount: doc.edition_count,
    ratingsAverage: doc.ratings_average,
    pageCount: doc.number_of_pages_median,
    hasFulltext: Boolean(doc.ia?.length),
  }
}

function subjectWorkToBook(work: SubjectWork): Book {
  return {
    id: workIdFromKey(work.key),
    title: work.title,
    authors: work.authors?.map((author) => author.name) ?? [],
    coverId: work.cover_id,
    coverEdition: work.cover_edition_key,
    firstPublishYear: work.first_publish_year,
    editionCount: work.edition_count,
    hasFulltext: Boolean(work.has_fulltext ?? work.ia?.length),
  }
}

function readDescription(
  description: WorkDetailResponse["description"]
): string | undefined {
  if (!description) return undefined
  return typeof description === "string" ? description : description.value
}

/** Best-effort resolution of author display names from their work keys. */
async function resolveAuthorNames(
  keys: string[],
  signal?: AbortSignal
): Promise<string[]> {
  const names = await Promise.all(
    keys.map(async (key) => {
      try {
        const author = await apiClient.get<AuthorResponse>(
          API_ENDPOINTS.author(key),
          signal
        )
        return author.name
      } catch {
        return undefined
      }
    })
  )
  return names.filter((name): name is string => Boolean(name))
}

export const bookService = {
  search: async (
    params: SearchParams,
    signal?: AbortSignal
  ): Promise<SearchResult> => {
    const response = await apiClient.get<SearchResponse>(
      API_ENDPOINTS.search(params),
      signal
    )
    return {
      books: (response.docs ?? []).map(docToBook),
      total: response.numFound ?? 0,
    }
  },

  listBySubject: async (
    subject: string,
    limit?: number,
    signal?: AbortSignal
  ): Promise<Book[]> => {
    const response = await apiClient.get<SubjectResponse>(
      API_ENDPOINTS.subject(subject, limit),
      signal
    )
    return (response.works ?? []).map(subjectWorkToBook)
  },

  getById: async (
    bookId: string,
    signal?: AbortSignal
  ): Promise<BookDetail> => {
    const work = await apiClient.get<WorkDetailResponse>(
      API_ENDPOINTS.work(bookId),
      signal
    )
    const id = workIdFromKey(work.key ?? bookId)
    const authorKeys = (work.authors ?? [])
      .map((entry) => entry.author?.key)
      .filter((key): key is string => Boolean(key))

    return {
      id,
      title: work.title,
      authors: await resolveAuthorNames(authorKeys, signal),
      description: readDescription(work.description),
      coverId: work.covers?.find((coverId) => coverId > 0),
      subjects: work.subjects ?? [],
      firstPublishDate: work.first_publish_date,
      openLibraryUrl: `${ENV.apiBaseUrl}/works/${id}`,
    }
  },
}
