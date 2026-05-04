# Development Guide

> Local development for the **Air Finance monorepo** (`air-finance-app`).

## Prerequisites

- **Node.js** `>= 24.x` (see root `package.json` `engines`)
- **Yarn 4** via Corepack (`corepack enable`)
- **Git**
- Running **Air Finance API** (separate repo) when exercising authenticated flows

Docker is optional for this workspace unless you run supporting services locally.

## Setup

```bash
git clone <repository-url>
cd air-finance-app
corepack enable
yarn install
```

Configure `apps/web` environment (see `apps/web/.env.development` or your local template) so `VITE_API_URL` points at your API.

```bash
yarn dev:web
```

## Scripts (root)

| Script | What it does |
| --- | --- |
| `yarn dev` | Turbo: all `dev` tasks |
| `yarn dev:web` | Vite dev server for `@air-finance/web` |
| `yarn dev:mobile` | Mobile WebView with tunnel |
| `yarn build` | Turbo build all workspaces |
| `yarn lint` | ESLint across workspaces |
| `yarn lint:fix` | ESLint with fix |
| `yarn typecheck` | `turbo run type-check` |
| `yarn format` | Prettier write |
| `yarn format:check` | Prettier check |
| `yarn clean` | Remove build outputs and `node_modules` |

## Scripts (`apps/web`)

| Script | What it does |
| --- | --- |
| `yarn workspace @air-finance/web test` | Vitest |
| `yarn workspace @air-finance/web test:coverage` | Vitest with coverage |
| `yarn workspace @air-finance/web lint` | ESLint web package |

## Project layout

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [MODULES.md](./MODULES.md).

## Coding conventions

- Code, tests, identifiers: **English**; UI copy follows product locale.
- **TypeScript**: no `any`; use `??` for nullish defaults; component props `readonly` where applicable.
- **Styling**: Tailwind, mobile-first, `dark:` variants.
- **State**: TanStack Query for server state; Zustand for UI-only client state.
- **Tests**: colocated `*.test.ts(x)`; TDD workflow in `.cursor/rules/sdd-protocol.mdc`.

## Git workflow

- Default branch: **`main`**.
- Conventional commits in English (`feat(scope):`, `fix(scope):`, …).
- PRs: description, test evidence for logic changes; screenshots for visible UI changes.

## SDD workflow

See [AGENTS.md](../AGENTS.md). Typical flow: discovery → constitution → `specs/<id>` → plan/tasks → implement → review.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `401` on API calls | Cookie domain / API URL mismatch | Align `VITE_API_URL` with API CORS and cookie settings |
| `yarn install` fails | Corepack / Node version | Use Node 24+ and `corepack enable` |
| Port in use | Stale Vite | Stop other dev servers or change Vite port |

## Pre-push checklist

- [ ] `yarn typecheck`
- [ ] `yarn lint`
- [ ] `yarn workspace @air-finance/web test` (when changing web logic)
- [ ] No secrets in diff
