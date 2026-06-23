/** Cross-cutting API transport types shared by every service. */

/** Standard error body shape we expect from the API on failure. */
export interface ApiErrorBody {
  error?: string
  message?: string
  details?: string
}

/** Generic paginated envelope (for APIs that wrap list responses). */
export interface Paginated<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
}
