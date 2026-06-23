import type { ReactNode } from "react"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"

interface AppProvidersProps {
  queryClient: QueryClient
  children: ReactNode
}

/**
 * Single composition point for app-wide context providers. Keeping them here
 * (rather than nested in main.tsx) makes the tree easy to reuse in tests.
 */
export function AppProviders({ queryClient, children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HelmetProvider>
  )
}
