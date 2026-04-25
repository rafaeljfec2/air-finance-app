# Air Finance Documentation

Documentation index for the Air Finance monorepo.

## Monorepo structure

```
air-finance-app/
├── apps/
│   ├── web/                    # React 18 + Vite SPA
│   └── mobile-webview/         # Expo + React Native WebView
├── packages/
│   └── shared/                 # Shared types, constants, utils
├── docs/                       # This documentation folder
├── turbo.json                  # Turborepo config
└── package.json                # Root workspace (Yarn 4)
```

## Document index

| Document | Purpose |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Monorepo structure, component hierarchy, state management, routing |
| [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Deep dive: layouts, data flow, safe areas, component patterns |
| [CREATING_PAGES.md](./CREATING_PAGES.md) | Step-by-step guide for adding new pages and features |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, spacing, UI components, accessibility |
| [MOBILE_FIRST_GUIDE.md](./MOBILE_FIRST_GUIDE.md) | Responsive design principles, breakpoints, testing |
| [AUTH_SESSION_IMPLEMENTATION.md](./AUTH_SESSION_IMPLEMENTATION.md) | JWT + HttpOnly cookies, token refresh, session flow |
| [SECURITY_FIX_REPORT.md](./SECURITY_FIX_REPORT.md) | Critical user data leak fix (Jan 2026) |
| [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) | Build config, env vars, Turborepo remote caching |
| [MIGRATION.md](./MIGRATION.md) | Monorepo migration record (from single-app repo) |
| [TECH_STACK.md](./TECH_STACK.md) | Exact dependency versions by category |
| [BUSINESS_DOMAIN.md](./BUSINESS_DOMAIN.md) | Product areas, multi-company model, subscription plans |
| [PRICING_ANALYSIS.md](./PRICING_ANALYSIS.md) | Subscription pricing strategy and cost analysis |
| [USABILITY_SUGGESTIONS.md](./USABILITY_SUGGESTIONS.md) | UX improvement ideas (FAB, gestures, haptics) |

## Quick start for new developers

1. Read the root [README.md](../README.md) for setup commands
2. Understand the architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Learn the design system: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
4. Create your first page: [CREATING_PAGES.md](./CREATING_PAGES.md)

## Quick start for new features

1. Plan file structure: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Follow page templates: [CREATING_PAGES.md](./CREATING_PAGES.md)
3. Use design tokens: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
4. Ensure mobile-first: [MOBILE_FIRST_GUIDE.md](./MOBILE_FIRST_GUIDE.md)
5. Import shared types from `@air-finance/shared`

## Related files outside docs/

| File | Purpose |
| --- | --- |
| `AGENTS.md` | AI agent briefing (structure, commands, guidance) |
| `CLAUDE.md` | Claude Code doc map, skills, precedence |
| `HARNESS.md` | Validation checklist (typecheck, lint, build, visual) |
| `.cursor/rules/general.mdc` | Always-on coding rules |
| `.cursor/rules/sdd-protocol.mdc` | SDD Protocol (TDD, file placement, quality gates) |
| `.cursor/rules/architecture.mdc` | Routing, services, state, layouts |
| `.cursor/rules/domain.mdc` | Business domain context for AI agents |

## Workspace packages

| Package | Path | Description |
| --- | --- | --- |
| `@air-finance/web` | `apps/web` | Main product UI (React + Vite + Tailwind) |
| `@air-finance/mobile-webview` | `apps/mobile-webview` | Expo + WebView wrapper |
| `@air-finance/shared` | `packages/shared` | Shared types, constants, utilities |

## Checklist (all changes)

- [ ] Follow established directory structure
- [ ] Use existing UI components from `components/ui/`
- [ ] Import shared types from `@air-finance/shared` where applicable
- [ ] Implement mobile-first (base styles, then `sm:`, `md:`, `lg:`)
- [ ] Support dark mode (`dark:` variants)
- [ ] Handle loading, error, and empty states
- [ ] Use strict TypeScript (no `any`)
- [ ] Run `yarn typecheck` and `yarn lint` before commit
