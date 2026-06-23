/**
 * Global test setup, loaded once before any test file (see vite.config.ts
 * `test.setupFiles`). Extends Vitest's `expect` with jest-dom matchers and
 * resets the DOM + mocks between tests.
 */

import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// jsdom does not implement scrollTo; TanStack Router's scroll restoration calls
// it during navigation. Stub it so integration tests don't log noise.
window.scrollTo = vi.fn() as typeof window.scrollTo

// jsdom does not implement matchMedia — provide a minimal, overridable stub so
// useMediaQuery works under test.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}
