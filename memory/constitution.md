# Project Constitution — Air Finance Monorepo

> Non-negotiable principles for `air-finance-app`. Complements root `AGENTS.md` and `.cursor/rules/*`.

## 1. Architecture Style

- **Turborepo** monorepo: `apps/web`, `apps/mobile-webview`, `packages/shared`.
- **BFF-less SPA**: the browser talks to the **Air Finance NestJS API** only; no Next.js server layer in this repo.
- **Feature organization**: routes → pages → hooks → services → `apiClient`; keep UI thin and test hooks/services.
- **Sibling systems**: treat `back-end-financeiro-nestjs` and `connexto-integration-bank` as separate deployables with their own docs and schemas.

## 2. Language and Runtime Versions

- **TypeScript** strict everywhere in app code; **no `any`**.
- **Node** `>= 24.x` for tooling (root `engines`).
- **Package manager**: **Yarn 4** (`packageManager` in root `package.json`); use Corepack in CI and Vercel.

## 3. Layering Rules

- **Server state**: TanStack Query only; invalidate on mutations consistently.
- **Client state**: Zustand for UI/auth session handles/active company selection per existing stores; never persist server financial aggregates as source of truth.
- **HTTP**: centralize in `apiClient` + feature `services/`; no ad-hoc `fetch` scattered across pages.
- **Layouts**: authenticated pages use `ViewDefault` inside `ProtectedLayout`; public auth flows use `LayoutAuth`.

## 4. Coding Standards

- **Nullish coalescing**: use `??`, not `||`, for defaults.
- **Props**: `readonly` on component props interfaces (Sonar S6759).
- **Styling**: Tailwind, **mobile-first**, touch-friendly targets, **dark:** variants.
- **Async**: `Promise.all` for independent parallel work; `Promise.allSettled` when partial failure is acceptable.
- **File size**: avoid files over **500 lines**; split before hitting the limit.
- **Comments**: no unnecessary comments; prefer clear names.

## 5. Testing Strategy and Coverage Thresholds

- **TDD** for hooks, services, utilities, and bugfixes: failing test first (see `.cursor/rules/sdd-protocol.mdc`).
- **Vitest** + Testing Library for web; colocated `*.test.ts(x)`; descriptions in **English**.
- **Mocks**: mock `apiClient` / HTTP at service boundaries; no mock financial data in dev or production paths.

## 6. Security Baseline

- **Secrets**: never commit `.env` with secrets; no tokens in client logs.
- **Auth**: follow [docs/AUTH_SESSION_IMPLEMENTATION.md](../docs/AUTH_SESSION_IMPLEMENTATION.md); respect HttpOnly cookies and refresh behavior.
- **Multi-company**: never trust client-sent `companyId` without backend validation (defense in depth on API; UI must not leak other companies’ data—see security report).
- **Dependencies**: prefer pinned/resolution overrides only when justified; review supply-chain on upgrades.

## 7. Observability Standard

- **Client**: structured user-visible errors (toasts / error boundaries); avoid `console.log` in production paths.
- **API observability** (logs, metrics, traces) is owned by the backend repo, not duplicated here.

## 8. Deployment Model

- **Web**: Vercel static build for `@air-finance/web` per [docs/VERCEL_DEPLOY.md](../docs/VERCEL_DEPLOY.md); `VITE_*` env at build time.
- **API / banking**: separate pipelines and environments; frontend must remain configurable via `VITE_API_URL` only.

## 9. SDD Workflow

- **Specs** live under `specs/`; discovery artifacts under `docs/` (`MODULES`, `DATA_MODEL`, `API`, `INTEGRATIONS`, `DEVELOPMENT`, `RUNBOOK`).
- Non-trivial features: spec → plan → tasks → implement → review; align cross-repo changes explicitly in specs.
