# AGENTS — air-finance-app

Turborepo monorepo: React 18 + Vite (`apps/web`), mobile WebView app, and `packages/shared`.

## Structure

| Path | Role |
| --- | --- |
| `apps/web` | Main product UI: `src/pages`, `src/components`, `src/hooks`, `src/services`, `src/stores`, `src/routes` |
| `apps/mobile-webview` | WebView wrapper and mobile-oriented dev server |
| `packages/shared` | Shared types and utilities |

## Commands (repository root)

- `yarn` — install dependencies
- `yarn dev` — all dev tasks via Turbo
- `yarn dev:web` — web app only
- `yarn dev:mobile` — mobile WebView with tunnel (see script in root `package.json`)
- `yarn build` — production build
- `yarn lint` — ESLint across workspaces
- `yarn typecheck` — TypeScript check

## Route and feature flow

1. Route in `apps/web/src/routes/`
2. Page in `apps/web/src/pages/<feature>/`
3. HTTP in `apps/web/src/services/`
4. Data hooks with TanStack Query in `apps/web/src/hooks/` (or feature folder)
5. UI composition with Tailwind + Radix/Headless under `components/`

## Route categories (conceptual)

- **Public**: marketing, auth entry, legal
- **Authenticated**: dashboard, transactions, accounts, cards, budget, goals, open finance, settings
- **Admin / ops**: gated routes for operational tools when present
- **SEO**: dedicated pages under `pages/seo/` with helmet metadata

## Environment

- Configure per app (e.g. `apps/web` Vite env prefixes). Do not commit `.env` files with secrets.

## AI agent guidance

- **CLAUDE.md**: Read first — Claude Code briefing with doc map, skills, and non-negotiable patterns
- **HARNESS.md**: Validation checklist — run after every change
- **SDD Protocol**: `.cursor/rules/sdd-protocol.mdc` — mandatory compliance for code generation

## Cursor

- Rules: `.cursor/rules/*.mdc` (replaces legacy `apps/web/.cursorrules` content)
- SDD: `.cursor/rules/sdd-protocol.mdc` — always-on protocol for AI-assisted development
- Repo skill: `.cursor/skills/frontend-dev/SKILL.md`

## Docs

- Start with `docs/README.md`, `docs/CREATING_PAGES.md`, and `docs/MOBILE_FIRST_GUIDE.md` for new work.
- Full doc index: `docs/README.md`
- Architecture: `docs/ARCHITECTURE.md`, `docs/FRONTEND_ARCHITECTURE.md`
- Design system: `docs/DESIGN_SYSTEM.md`
- Mobile: `docs/MOBILE_FIRST_GUIDE.md`
- Auth: `docs/AUTH_SESSION_IMPLEMENTATION.md`
- Security: `docs/SECURITY_FIX_REPORT.md`
- Deploy: `docs/VERCEL_DEPLOY.md`
- Migration: `docs/MIGRATION.md`
- Tech stack: `docs/TECH_STACK.md`
- Business domain: `docs/BUSINESS_DOMAIN.md`
- Pricing: `docs/PRICING_ANALYSIS.md`
- UX ideas: `docs/USABILITY_SUGGESTIONS.md`
