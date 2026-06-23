import { describe, expect, it } from "vitest"

import { ApiError } from "@/lib/http/api-error"

describe("ApiError", () => {
  it("flags 4xx responses as client errors", () => {
    const error = new ApiError("Bad request", 400)
    expect(error.isClientError).toBe(true)
    expect(error.isNetworkError).toBe(false)
  })

  it("does not flag 5xx responses as client errors", () => {
    expect(new ApiError("Server error", 500).isClientError).toBe(false)
  })

  it("flags status 0 as a network error", () => {
    expect(new ApiError("Offline", 0).isNetworkError).toBe(true)
  })

  it("flags 404 as not found", () => {
    expect(new ApiError("Missing", 404).isNotFound).toBe(true)
  })

  it("retains the message, status and details", () => {
    const error = new ApiError("Nope", 422, "field invalid")
    expect(error.message).toBe("Nope")
    expect(error.status).toBe(422)
    expect(error.details).toBe("field invalid")
    expect(error).toBeInstanceOf(Error)
  })
})
