---
name: frontend-dev
description: Air Finance monorepo — pages, services, hooks, design system, and docs map
---

# Frontend development (air-finance-app)

Use this skill when adding routes, pages, hooks, services, or shared UI in the Turborepo.

## New page checklist

1. **Route**: add entry in `apps/web/src/routes/` (follow existing lazy import pattern)
2. **Page**: create `apps/web/src/pages/<area>/` with `index.tsx` and, if the feature uses split layouts, `desktop.tsx` / `mobile.tsx`
3. **Layout**: wrap with `ViewDefault` or `LayoutDefault` / `LayoutAuth` consistent with neighboring pages
4. **Service**: add or extend `apps/web/src/services/<feature>Service.ts` using the shared `apiClient`
5. **Server state**: TanStack Query hooks in `hooks/` (query keys colocated or in a small `keys` module)
6. **Client state**: Zustand only when UI or cross-route client state requires it
7. **Forms**: `react-hook-form` + zod resolver; reuse input components from `components/`

## Component patterns

- Tailwind for layout and spacing; Radix / Headless for accessible primitives
- Use CVA for variants when the codebase already does for that family of components
- Keep props interfaces explicit and `readonly`

## Where things live

- **Pages**: `apps/web/src/pages/`
- **Global components**: `apps/web/src/components/`
- **Hooks**: `apps/web/src/hooks/` and feature-local hooks under `pages/<feature>/hooks/` when used
- **Stores**: `apps/web/src/stores/`
- **Services**: `apps/web/src/services/`

## Mobile WebView

- Test critical flows thinking `apps/mobile-webview` viewport; avoid desktop-only assumptions in shared code

## Documentation (`docs/`)

Twelve documents include `ARCHITECTURE.md`, `FRONTEND_ARCHITECTURE.md`, `CREATING_PAGES.md`, `MOBILE_FIRST_GUIDE.md`, `DESIGN_SYSTEM.md`, `MIGRATION.md`, auth session notes, and deploy guides. Read `CREATING_PAGES.md` before adding a new area.

## Commands (root)

- `yarn dev` / `yarn dev:web` — local development
- `yarn build` — Turborepo build
- `yarn lint` — lint all workspaces
- `yarn typecheck` — TypeScript across workspaces

## Legacy rules

- Previous Cursor rules in `apps/web/.cursorrules` were migrated into `.cursor/rules/general.mdc`; that file now only points to the root `.cursor/` layout.
