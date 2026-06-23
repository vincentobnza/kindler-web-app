# Kindler — Read more, beautifully

A fast, browser-based reading companion. Discover, search and save books from
the [Open Library](https://openlibrary.org) — no account, no API key, no
backend. Built **feature-first** with a warm, editorial paper-and-ink design.

## Stack

React 19 (+ **React Compiler**) · TypeScript (strict) · Vite · Tailwind CSS v4 ·
TanStack Router · TanStack Query · Zustand · `motion/react` · Radix UI + CVA ·
`react-helmet-async` · Vitest + Testing Library · ESLint · Prettier · Husky +
lint-staged.

Type: **Lexend** (UI, `-0.03em` tracking) + **EB Garamond** (serif headings).

## Getting started

```bash
# 1. Install
npm install

# 2. Configure env (optional — sensible defaults are used)
cp .env.example .env

# 3. Run the dev server
npm run dev          # http://localhost:5173
```

Book data comes straight from the public Open Library API, so the app works with
zero setup. Override `VITE_API_BASE_URL` / `VITE_COVERS_BASE_URL` to point
elsewhere.

## Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                      |
| `npm run build`         | Type-check (`tsc -b`) and build for production |
| `npm run preview`       | Preview the production build                   |
| `npm run typecheck`     | Type-check only                                |
| `npm run lint`          | Run ESLint                                     |
| `npm run lint:fix`      | ESLint with autofix                            |
| `npm run format`        | Prettier (import + Tailwind class sorting)     |
| `npm test`              | Run the test suite once                        |
| `npm run test:watch`    | Run tests in watch mode                        |
| `npm run test:coverage` | Run tests with coverage                        |

## Architecture

Feature-based, with strict separation of concerns:

```text
src/
  app/         Composition root — providers, query client, router
  config/      Typed env access (the only reader of import.meta.env)
  constants/   Routes, endpoints, query keys, storage keys, labels, flags
  types/       Shared domain + API types (book)
  lib/         Framework-agnostic helpers — http, format, hooks, seo, utils
  components/  Cross-feature UI — ui / common / feedback / seo
  layout/      App shell — top nav, bottom nav, footer
  features/    One self-contained folder per feature
tests/         unit / component / integration (mirrors src/)
```

Each feature owns its `components`, `hooks`, `services`, `queries`, `stores`,
`pages`, `constants` and `types`. See **[AGENTS.md](./AGENTS.md)** for the full
engineering guide and conventions.

## Features

- **Discover** (`features/home`) — an animated `motion/react` hero with a search
  entry point, plus curated, horizontally-scrolling subject shelves.
- **Browse** (`features/books`) — URL-driven search (`/browse?q=…`, shareable &
  back-button friendly) over the Open Library, with covers, ratings, paging and
  loading / empty / error states. A detail page renders the cover, description
  and subjects, and links out to read online.
- **Library** (`features/library`) — save books to read later. A persisted
  Zustand store (`localStorage`) keyed by work id, with a reusable `SaveButton`.

Server state flows through typed `services` → `queryOptions` factories (shared by
router loaders and component hooks); client state lives in small Zustand stores.
The **React Compiler** auto-memoizes components, so the code stays free of manual
`useMemo` / `useCallback` / `React.memo`.

## Design

Light-mode only, editorial and elegant: a warm paper background (`#F7F4ED`),
near-black ink, and crisp solid-black hairline borders. Mobile-first throughout,
with the page capped at `max-w-5xl`. Tokens are semantic CSS variables in
`src/index.css`, bridged to Tailwind via `@theme inline`.

## Testing

Vitest + Testing Library, organised under `/tests` into `unit/`, `component/`
and `integration/`. Tests mock at the **service boundary** so hook/query/store
layers run for real. See [tests/README.md](./tests/README.md).

## Data & credits

Book data and cover images are provided by [Open Library](https://openlibrary.org),
a project of the Internet Archive. Kindler is an independent reading companion and
is not affiliated with Open Library or Amazon Kindle.
