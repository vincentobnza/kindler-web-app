/** Factory for the shared TanStack Query client. */

import { QueryClient } from "@tanstack/react-query"

import {
  QUERY_GC_TIME_MS,
  QUERY_RETRY_COUNT,
  QUERY_STALE_TIME_MS,
} from "@/constants/app-config"
import { ApiError } from "@/lib/http/api-error"

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
        // Never burn retries on 4xx responses — they won't recover.
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.isClientError) return false
          return failureCount < QUERY_RETRY_COUNT
        },
      },
    },
  })
}
