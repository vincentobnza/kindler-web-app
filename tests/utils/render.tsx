/**
 * Shared test render helpers. `renderWithProviders` wraps the subject in the
 * same context stack as the real app (Helmet + Query + a memory Router) so
 * components that use <Link>, <Seo> or `useQuery` render without ceremony.
 */

import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"

/** A QueryClient tuned for tests: no retries, no caching between tests. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  })
}

interface RenderOptions {
  queryClient?: QueryClient
  initialEntries?: string[]
}

export function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
  const queryClient = options.queryClient ?? createTestQueryClient()

  const result = render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={options.initialEntries ?? ["/"]}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )

  return { ...result, queryClient }
}

export { render }
