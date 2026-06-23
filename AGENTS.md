# AGENTS.md

> Canonical engineering guide for **Sudo Boiler** — a production-ready,
> feature-based React + TypeScript frontend boilerplate.
>
> This is the single source of truth for coding standards. `CLAUDE.md`,
> `GEMINI.md`, `COPILOT.md` and `.cursorrules` all defer to this file. Keep
> them thin; change rules **here**.

## 1. Tech stack

| Concern      | Choice                                            |
| ------------ | ------------------------------------------------- |
| Build / dev  | Vite                                              |
| Language     | TypeScript (strict)                               |
| UI           | React 19                                          |
| Styling      | Tailwind CSS v4 (CSS-first config, design tokens) |
| Routing      | TanStack Router (code-split, loader prefetch)     |
| Server state | TanStack Query                                    |
| Client state | Zustand (+ `persist` for durable state)           |
| Components   | shadcn-style primitives + Radix UI + CVA          |
| Icons        | `react-icons`                                     |
| Head / SEO   | `react-helmet-async`                              |
| Testing      | Vitest + Testing Library                          |
| Quality      | ESLint, Prettier, Husky, lint-staged              |

## 2. Folder structure

```text
src/
  app/         Composition root — providers, query client, router
  config/      Typed environment access (the ONLY reader of import.meta.env)
  constants/   Routes, endpoints, query keys, storage keys, labels, flags…
  types/       Shared domain + API types
  lib/         Framework-agnostic helpers — http, format, hooks, seo, utils
  components/  Cross-feature UI — ui / common / feedback / seo
  layout/      App shell — top nav, bottom nav, footer
  features/    One folder per feature, fully self-contained
tests/         unit / component / integration (mirrors src/)
```

### Feature anatomy

A feature owns everything it needs and nothing it doesn't:

```text
features/<feature>/
  components/   Presentational + container components for this feature
  hooks/        React hooks (use*)
  services/     Data access — the only place that knows endpoint shapes
  queries/      TanStack Query option factories (queryOptions)
  stores/       Zustand stores (*-store.ts)
  pages/        Route-level components (lazy-loaded by the router)
  constants/    Feature-local constants
  types.ts      Feature-local types
```

**Dependency direction:** `features/*` may import from `lib`, `components`,
`constants`, `config`, `types`. Cross-feature imports are allowed but should be
deliberate (e.g. `books` uses `library`'s `SaveButton`). `lib` and
`components/ui` must NOT import from `features`.

## 3. Naming conventions

| Thing              | Convention        | Example               |
| ------------------ | ----------------- | --------------------- |
| Folders            | kebab-case        | `video-player/`       |
| Components / files | PascalCase        | `UserCard.tsx`        |
| Hooks              | `use` + camelCase | `useUsers.ts`         |
| Zustand stores     | `*-store.ts`      | `favorites-store.ts`  |
| Services           | `*-service.ts`    | `user-service.ts`     |
| Query factories    | `*-queries.ts`    | `user-queries.ts`     |
| Constants (values) | UPPER_SNAKE_CASE  | `QUERY_STALE_TIME_MS` |
| Types / interfaces | PascalCase        | `interface User`      |
| Imports            | absolute via `@/` | `@/lib/utils`         |

## 4. Constants-first (NON-NEGOTIABLE)

No hardcoded strings, magic numbers, or duplicated literals. Extract to
`src/constants/`:

- Route paths → `routes.ts` (`ROUTE_PATHS`, `buildPath`)
- API endpoints → `api-endpoints.ts` (`API_ENDPOINTS`)
- Query keys → `query-keys.ts` (`QUERY_KEYS`)
- localStorage keys → `storage-keys.ts` (`STORAGE_KEYS`)
- Tunables / timings / sizes → `app-config.ts`
- User-facing copy → `ui-labels.ts` (`UI_LABELS`)
- Validation rules → `validation.ts`
- Feature flags → `feature-flags.ts` (`FEATURE_FLAGS`)
- Theme tokens/modes → `theme.ts`
- Breakpoints → `breakpoints.ts`

## 5. Data & state

- **Server state → TanStack Query.** Define a `queryOptions` factory in
  `queries/` so route loaders prefetch and hooks consume the _same_ config.
  Services return typed data via the `apiClient`; never call `fetch` in a
  component. Use `QUERY_KEYS` for every key.
- **Client state → Zustand.** Keep stores small and action-oriented. Persist
  durable state with the `persist` middleware and a `STORAGE_KEYS` name. Select
  narrow slices (`useStore(s => s.value)`) to avoid needless re-renders.
- **URL state → the router.** Route params and validated search params are the
  source of truth for shareable state.

## 6. Design system

- **Light-mode only.** An editorial "paper & ink" aesthetic: warm paper
  background (`#F7F4ED`), near-black ink, and crisp **solid black hairline
  borders**. There is no dark theme.
- Style with semantic Tailwind tokens (`bg-background`, `text-muted-foreground`,
  `border-border`, `rounded-lg`), **never** raw colors like `bg-zinc-900`.
- Tokens are CSS variables on `:root` in `src/index.css`, bridged to Tailwind
  via `@theme inline`. Add a token there, then map it once under `@theme inline`.
- **Typography:** **Lexend** for UI/body (`--font-sans`, `-0.03em` tracking),
  **EB Garamond** for headings and long-form reading (`--font-heading`). All
  `h1–h6` and book titles render in the serif.
- **No shadows on cards.** The design is border-led: separate surfaces with the
  solid hairline `border-border`, never `shadow-*`. Avoid shadows generally.
- **Mobile-first & responsive:** style the base (mobile) case, then layer
  `sm: md: lg:` overrides. Page content is capped at `max-w-5xl`. Test at 360px,
  768px and 1280px. Honour `prefers-reduced-motion`.
- **Images:** use the shared `BookCover` (lazy + async-decoded, retina `srcSet`,
  fixed 2:3 ratio to avoid layout shift); set `priority` only for an
  above-the-fold cover.
- Compose class names with `cn()` from `@/lib/utils`. Define variants with
  `cva` in a sibling `*-variants.ts` file.

## 7. Components

- Function components only. Type props with an explicit `interface` (or
  `React.ComponentProps<...>` when extending a DOM element).
- Keep components small and composable; lift data fetching into hooks.
- Provide loading (skeleton), error (`ErrorState`) and empty (`EmptyState`)
  states for any view backed by async data.
- **Bottom sheets** (mobile dialogs that slide up from the bottom) must render
  the shared `SheetGrabber` (`components/ui/sheet-grabber.tsx`) as the drag
  handle at the top — it is the single source of truth for the pill's size,
  radius and color. Pass `className` only to tune spacing (margins) for the
  sheet's layout, never to restyle the pill.
- Accessibility is required: semantic elements, labelled controls
  (`aria-label`), visible focus, keyboard operability.
- Add a `<Seo />` to every page-level component.

## 8. Testing requirements

- Framework: **Vitest + Testing Library**. Tests live in `/tests`, mirroring
  `src/`, split into `unit/`, `component/`, `integration/`.
- Test all business logic (lib helpers, stores), reusable hooks, utilities,
  critical UI interactions, and API integrations (mock at the service layer).
- Every feature ships tests. Query by role/label, not test ids.
- Commands: `npm test`, `npm run test:watch`, `npm run test:coverage`.

## 9. Code quality

- `npm run typecheck` — TypeScript strict, must pass with zero errors.
- `npm run lint` — ESLint, zero warnings.
- `npm run format` — Prettier (import sorting + Tailwind class sorting).
- Husky `pre-commit` runs lint-staged (ESLint + Prettier on staged files).
- Prefer `type` imports (`import type`), early returns, and pure functions in
  `lib`.

## 10. Do's and Don'ts

**Do**

- Reuse existing primitives (`Button`, `Container`, `EmptyState`, `cn`).
- Put a new screen behind a route + lazy page component + `queryOptions`.
- Add new copy to `UI_LABELS`, new endpoints to `API_ENDPOINTS`, etc.
- Keep features self-contained; extract truly shared code up to `lib`/`components`.

**Don't**

- ❌ Hardcode strings, URLs, keys, colors or magic numbers.
- ❌ Read `import.meta.env` outside `config/env.ts`.
- ❌ Call `fetch` directly in a component — go through a service.
- ❌ Use heavy borders/shadows in dark mode.
- ❌ Import `features/*` from `lib` or `components/ui`.
- ❌ Add a dependency that overlaps one already in `package.json`.
