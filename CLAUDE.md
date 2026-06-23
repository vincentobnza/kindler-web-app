# CLAUDE.md

Guidance for Claude / Claude Code working in this repository.

## Read this first

**[AGENTS.md](./AGENTS.md) is the canonical engineering guide.** Read it before
writing code. This file only highlights what matters most.

## TL;DR rules

- **Feature-based:** each feature in `src/features/<feature>/` owns its
  `components / hooks / services / queries / stores / pages / constants / types`.
- **Constants-first:** never hardcode routes, endpoints, query keys, storage
  keys, labels, colors, or magic numbers. Use `src/constants/*`.
- **Server state → TanStack Query** via `queryOptions` factories in `queries/`,
  fed by typed `services/` that call `apiClient` (never `fetch` in components).
- **Client state → Zustand**; persist durable state with `persist` +
  `STORAGE_KEYS`.
- **Styling → semantic Tailwind tokens** (`bg-background`, `border-border`),
  composed with `cn()`; variants via `cva` in `*-variants.ts`. Mobile-first,
  capped at `max-w-5xl`.
- **Design:** light-mode only — warm paper (`#F7F4ED`), near-black ink, solid
  black hairline borders. Lexend body (`-0.03em`), EB Garamond serif headings.
  **No shadows on cards** — surfaces are separated by the hairline border, never
  `shadow-*`. Optimize images via the shared `BookCover` (lazy, `srcSet`).
- **Every page** gets a `<Seo />` and loading / error / empty states.
- **Tests** live in `/tests` (unit / component / integration); mock at the
  service boundary. Every feature ships tests.

## Before you finish

Run and keep green:

```bash
npm run typecheck && npm run lint && npm test
```

## Workflow notes

- Imports are absolute via `@/`. Prefer `import type` for types.
- Match the surrounding style: no semicolons, double quotes, 2-space indent
  (Prettier enforces this).
- When adding a route: add it to `ROUTE_PATHS`, create a lazy page in
  `features/<f>/pages`, wire a `queryOptions` loader in `app/router.tsx`, and
  add a nav entry in `constants/navigation.ts` if user-visible.
