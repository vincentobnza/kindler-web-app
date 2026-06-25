/**
 * Route path templates (TanStack Router `$param` syntax) plus helpers for
 * building concrete hrefs (used for links, canonical URLs and sharing).
 * Every route string lives here — never hardcode a path elsewhere.
 *
 * `bookId` is the Open Library work id WITHOUT the `/works/` prefix
 * (e.g. `OL893415W`); the service re-adds the prefix when calling the API.
 */

export const ROUTE_PATHS = {
  home: "/",
  browse: "/browse",
  bookDetail: "/book/:bookId",
  bookRead: "/book/:bookId/read",
  library: "/library",
  notFound: "*",
} as const

/** Builds absolute-path hrefs from params (no origin). */
export const buildPath = {
  home: (): string => "/",
  browse: (): string => "/browse",
  bookDetail: (bookId: string): string => `/book/${bookId}`,
  bookRead: (bookId: string): string => `/book/${bookId}/read`,
  library: (): string => "/library",
} as const

/** Prefixes a path with the public site origin for canonical/OG URLs. */
export function toAbsoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}
