# Harness — Air Finance App

> Validation guide for AI agents (Cursor, Claude Code). Run these checks after every change.

## Quick validation (run after every change)

```bash
yarn typecheck    # TypeScript compilation check
yarn lint         # ESLint across all workspaces
```

## Full validation (run before commits or PRs)

```bash
yarn typecheck && yarn lint && yarn build
```

## Visual validation checklist

After UI changes, verify in the browser:

| Check | How to verify |
| --- | --- |
| Mobile layout | Chrome DevTools → Toggle device toolbar → iPhone SE (375px) |
| Tablet layout | Chrome DevTools → iPad (768px) |
| Desktop layout | Full browser window (1280px+) |
| Dark mode | Toggle theme in app settings or browser dev tools |
| Loading state | Throttle network in DevTools → Slow 3G |
| Error state | Disconnect API or return error from service |
| Empty state | Use account with no data for the feature |
| Safe areas | Test with iPhone X+ simulator (notch) |

## Route validation

After adding/modifying routes:

1. Navigate to the new route in the browser
2. Verify lazy loading works (check network tab for chunk)
3. Verify `ProtectedRoute` wrapper is present for authenticated routes
4. Verify `ViewDefault` wraps authenticated page content
5. Verify `LayoutAuth` wraps public page content

## Component validation

After creating/modifying components:

| Rule | How to check |
| --- | --- |
| Props are `readonly` | Check interface declaration |
| No `any` types | `yarn typecheck` or search for `: any` |
| Mobile-first classes | Tailwind classes start with base, then `sm:`, `md:`, `lg:` |
| Dark mode support | All color classes have `dark:` variants |
| Touch targets | Interactive elements ≥ 44x44px |
| Uses design system | Colors from `primary-*`, `text`, `card`, `border`, `background` |

## Service validation

After creating/modifying services:

| Rule | How to check |
| --- | --- |
| Uses `apiClient` | Import from `services/apiClient` |
| Returns typed data | Check return type annotation |
| Error handling | Verify catch blocks or error propagation |
| No hardcoded URLs | Uses env vars or apiClient baseURL |

## Hook validation

After creating/modifying hooks:

| Rule | How to check |
| --- | --- |
| TanStack Query for server state | Uses `useQuery`/`useMutation` |
| Query keys are consistent | Follow existing key patterns |
| Invalidation on mutation | `queryClient.invalidateQueries` in `onSuccess` |
| No server state in Zustand | Zustand only for UI state |

## Pre-commit gate

The following MUST pass before any commit:

```bash
# All three must exit 0
yarn typecheck
yarn lint
yarn build
```

## Environment

- Node.js: 18.x or 20.x
- Yarn: 4.x (Berry) via Corepack
- Turborepo manages workspace builds

## Workspace-specific commands

```bash
# Run command in specific workspace
yarn workspace @air-finance/web typecheck
yarn workspace @air-finance/web lint
yarn workspace @air-finance/web build

# Run all dev tasks
yarn dev

# Run only web
yarn dev:web
```
