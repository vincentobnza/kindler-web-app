/** Typed error thrown by the API client so the UI can branch on status. */

export class ApiError extends Error {
  readonly status: number
  readonly details?: string

  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }

  /** True for 4xx responses that won't be fixed by retrying. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  /** True for transport-level failures (no HTTP status reached). */
  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  /** True when the server rejected the request as unprocessable (422). */
  get isUnprocessable(): boolean {
    return this.status === 422
  }
}
