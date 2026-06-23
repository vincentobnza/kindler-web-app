/* eslint-disable react-refresh/only-export-components -- the router module intentionally co-locates route config with small inline fallback components */
import type { QueryClient } from "@tanstack/react-query"
import {
  createBrowserRouter,
  useRouteError,
  type RouteObject,
} from "react-router-dom"

import { ROUTE_PATHS } from "@/constants/routes"
import { UI_LABELS } from "@/constants/ui-labels"
import { VALIDATION_RULES } from "@/constants/validation"
import { ErrorState } from "@/components/feedback/ErrorState"
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner"
import { NotFound } from "@/components/feedback/NotFound"
import { Seo } from "@/components/seo/Seo"
import { AppShell } from "@/layout/AppShell"
import {
  bookQueryOptions,
  searchBooksQueryOptions,
} from "@/features/books/queries/book-queries"

function RouteNotFound() {
  return (
    <>
      <Seo title={UI_LABELS.states.notFound} noIndex />
      <NotFound />
    </>
  )
}

/** Shown while a lazy route chunk / initial loader resolves. */
function RouteFallback() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <LoadingSpinner label={UI_LABELS.states.loading} />
    </div>
  )
}

/** Catches loader/render errors anywhere in the tree. */
function RouteErrorBoundary() {
  const error = useRouteError()
  return (
    <div className="grid min-h-svh place-items-center p-6">
      <ErrorState error={error} />
    </div>
  )
}

/**
 * Builds the route tree. Loaders warm the TanStack Query cache (non-blocking,
 * so navigation stays instant); the page hooks read the same `queryOptions`.
 * Exported so tests can mount the real tree via `createMemoryRouter`.
 */
export function createAppRoutes(queryClient: QueryClient): RouteObject[] {
  return [
    {
      element: <AppShell />,
      errorElement: <RouteErrorBoundary />,
      HydrateFallback: RouteFallback,
      children: [
        {
          path: ROUTE_PATHS.home,
          lazy: async () => {
            const { HomePage } = await import("@/features/home/pages/HomePage")
            return { Component: HomePage }
          },
        },
        {
          path: ROUTE_PATHS.browse,
          loader: ({ request }) => {
            const query =
              new URL(request.url).searchParams.get("q")?.trim() ?? ""
            if (query.length >= VALIDATION_RULES.search.minLength) {
              void queryClient.prefetchQuery(searchBooksQueryOptions(query, 1))
            }
            return null
          },
          lazy: async () => {
            const { BrowsePage } = await import(
              "@/features/books/pages/BrowsePage"
            )
            return { Component: BrowsePage }
          },
        },
        {
          path: ROUTE_PATHS.bookDetail,
          loader: ({ params }) => {
            if (params.bookId) {
              void queryClient.prefetchQuery(bookQueryOptions(params.bookId))
            }
            return null
          },
          lazy: async () => {
            const { BookDetailPage } = await import(
              "@/features/books/pages/BookDetailPage"
            )
            return { Component: BookDetailPage }
          },
        },
        {
          path: ROUTE_PATHS.library,
          lazy: async () => {
            const { LibraryPage } = await import(
              "@/features/library/pages/LibraryPage"
            )
            return { Component: LibraryPage }
          },
        },
        { path: ROUTE_PATHS.notFound, element: <RouteNotFound /> },
      ],
    },
  ]
}

export function createAppRouter(queryClient: QueryClient) {
  return createBrowserRouter(createAppRoutes(queryClient))
}
