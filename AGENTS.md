# AGENTS — air-finance-app

This repo is the AirFinance **frontend** (Turborepo: React 18 + Vite `apps/web`, mobile WebView, `packages/shared`).
It is **not** Product OS, backend domain, or bank connectors.

This Workspace is multi-root. Constitution: `air-finance-app-workspace/AGENTS.md`. Strategy: `connexto-os/docs/airfinance/`.

## Read first

1. Workspace constitution (`air-finance-app-workspace/AGENTS.md`) when the multi-root is open
2. This `AGENTS.md` (shared contract for Cursor, Claude Code, Codex)
3. SPEC + IS of the delivery in `connexto-os/docs/airfinance/`
4. `docs/README.md` for the doc index
5. `.cursor/rules/sdd-protocol.mdc` before generating feature code
6. `HARNESS.md` after every change

`CLAUDE.md` is a Claude Code adapter (doc map / skills). Do not read it instead of this file.

## Hierarchy of truth

Follow the Workspace constitution: Product OS → Blueprint → Platform → SPEC → Dev OS → IS → code.
SPEC is the active contract **if** aligned with Product OS / Blueprint. Official-doc conflict → stop and escalate.

## Do / Don't

**Do:** reuse pages, hooks, services, UI primitives; mobile-first; TanStack Query for server state; Zustand for UI only; `??` not `||`; no `any`; TDD for hooks/services/logic.

**Don't:** invent product/UX; skip `ViewDefault` / `LayoutAuth`; mock data outside tests; put domain rules only on the client; call banks directly (that is `connexto-integration-bank`).

## Map

| Path | Role |
| --- | --- |
| `apps/web` | Product UI: `src/pages`, `components`, `hooks`, `services`, `stores`, `routes` |
| `apps/mobile-webview` | WebView wrapper |
| `packages/shared` | Shared types and utilities |

Flow: Route → Page → Hook → Service (`apiClient`) → TanStack Query → UI.

## Commands

```bash
yarn
yarn dev:web
yarn build
yarn lint
yarn typecheck
```

## Critical flows

- **Public:** marketing, auth, legal
- **Authenticated:** dashboard, transactions, accounts, cards, budget, goals, open finance, settings
- **Auth pages:** `ViewDefault`; public: `LayoutAuth`

## Escalation

Product, UX, journey, or SPEC vs OS/Blueprint → document and wait. Do not invent.

## Validation

See `HARNESS.md`. Minimum: `yarn typecheck` + `yarn lint`. Before PR: also `yarn build`. Mobile 375px, dark mode, empty/loading/error.

## Tool adapters

- **Claude Code:** `CLAUDE.md` (area doc map + skills)
- **Cursor:** `.cursor/rules/*.mdc` (globs; SDD in `sdd-protocol.mdc`)
- **Skill:** `.cursor/skills/frontend-dev/SKILL.md`
