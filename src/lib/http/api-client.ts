/**
 * Thin, typed HTTP client. Centralises base-URL resolution, JSON parsing,
 * abort handling and error normalisation into {@link ApiError} so services
 * never touch `fetch` directly.
 */

import { ENV } from "@/config/env"
import type { ApiErrorBody } from "@/types/api"

import { ApiError } from "./api-error"

interface RequestOptions {
  signal?: AbortSignal
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>
}

function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${ENV.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    throw new ApiError(
      "Received a malformed response from the server.",
      response.status
    )
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  let response: Response
  try {
    response = await fetch(resolveUrl(path), {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    // Re-throw aborts untouched so callers/Query can ignore them.
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error
    }
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0
    )
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const errorBody = (payload ?? {}) as ApiErrorBody
    throw new ApiError(
      errorBody.error ||
        errorBody.message ||
        `Request failed with status ${response.status}`,
      response.status,
      errorBody.details
    )
  }

  return payload as T
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal): Promise<T> =>
    request<T>("GET", path, undefined, { signal }),

  post: <T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>("POST", path, body, { signal }),

  put: <T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>("PUT", path, body, { signal }),

  patch: <T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>("PATCH", path, body, { signal }),

  delete: <T>(path: string, signal?: AbortSignal): Promise<T> =>
    request<T>("DELETE", path, undefined, { signal }),
}
