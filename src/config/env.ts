/**
 * Centralised, typed access to build-time environment configuration.
 * Nothing else in the app should read `import.meta.env` directly — import
 * from here so defaults and parsing live in one place.
 */

const DEFAULT_API_BASE_URL = "https://openlibrary.org"
const DEFAULT_COVERS_BASE_URL = "https://covers.openlibrary.org"
const DEFAULT_SITE_URL = "http://localhost:5173"

export interface AppEnv {
  /** Open Library JSON API origin (search + works). */
  readonly apiBaseUrl: string
  /** Open Library cover-image CDN origin. */
  readonly coversBaseUrl: string
  readonly siteUrl: string
  readonly enableAnalytics: boolean
  readonly isProduction: boolean
  readonly mode: string
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return value.trim().toLowerCase() === "true"
}

function resolveEnv(): AppEnv {
  const apiBaseUrl = trimTrailingSlash(
    import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  )
  const coversBaseUrl = trimTrailingSlash(
    import.meta.env.VITE_COVERS_BASE_URL?.trim() || DEFAULT_COVERS_BASE_URL
  )
  const siteUrl = trimTrailingSlash(
    import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL
  )

  return {
    apiBaseUrl,
    coversBaseUrl,
    siteUrl,
    enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS, false),
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  }
}

export const ENV: AppEnv = resolveEnv()
