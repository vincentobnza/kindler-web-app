# Tests

Vitest + Testing Library. Run with `npm test` (CI mode) or `npm run test:watch`.

```text
tests/
  setup.ts          Global setup: jest-dom matchers, cleanup, matchMedia stub
  utils/render.tsx  renderWithProviders — Helmet + Query + memory Router
  fixtures/         Reusable test data
  unit/             Pure logic: lib helpers, stores (no DOM dependency)
  component/        Single components rendered in isolation
  integration/      Feature flows across hooks, services, stores and the DOM
```

## Conventions

- Co-locate nothing in `src/` — all tests live here, mirroring the source tree.
- Import test globals explicitly from `vitest` (`describe`, `it`, `expect`).
- Mock at the **service boundary** (`*-service.ts`), never `fetch` directly,
  so the hook/query layers are exercised for real.
- Query by accessible role/label, not test ids, to keep tests behaviour-driven.
- Every feature should ship unit tests for its logic and at least one
  component or integration test for its critical UI path.
