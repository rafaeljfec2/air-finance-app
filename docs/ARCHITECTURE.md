# Architecture -- Air Finance

## Monorepo layout

```
air-finance-app/
├── apps/
│   ├── web/                    # @air-finance/web — React 18 + Vite 5 SPA
│   │   └── src/
│   │       ├── assets/         # Images, fonts, static files
│   │       ├── components/     # Reusable components (ui/, layout/, feature/)
│   │       ├── contexts/       # React Context providers
│   │       ├── features/       # Domain-specific feature modules
│   │       ├── hooks/          # Global custom hooks
│   │       ├── layouts/        # ProtectedLayout, ViewDefault, LayoutAuth, LayoutDefault
│   │       ├── lib/            # Utility helpers (cn, etc.)
│   │       ├── pages/          # Route page components
│   │       ├── routes/         # Route definitions (createBrowserRouter)
│   │       ├── services/       # API client and feature services
│   │       ├── stores/         # Zustand stores (UI state only)
│   │       ├── types/          # TypeScript types and interfaces
│   │       └── utils/          # Pure utility functions
│   └── mobile-webview/         # @air-finance/mobile-webview — Expo 55 + WebView
├── packages/
│   └── shared/                 # @air-finance/shared — types, constants, utils
├── turbo.json                  # Turborepo task config
└── package.json                # Yarn 4 workspaces
```

## Component hierarchy

```
App
├── Router (createBrowserRouter)
│   ├── Public routes (LandingPageV3, Login, SignUp, SEO pages)
│   └── ProtectedLayout (auth guard + ErrorBoundary + Suspense)
│       └── ViewDefault (Header, Sidebar, MobileBottomNav)
│           └── [Page Components]
│               ├── [Feature Components]
│               └── [UI Components]
```

### Layouts

| Layout | Purpose |
| --- | --- |
| `ProtectedLayout` | Wraps all authenticated routes; provides `ProtectedRoute`, `ErrorBoundary`, `Suspense`, `AnnouncementsProvider` |
| `ViewDefault` | Main chrome for authenticated pages: Header, Sidebar (collapsible), MobileBottomNav, CompanySelectionModal, TransactionTypeModal |
| `LayoutAuth` | Layout for public auth pages (login, signup) |
| `LayoutDefault` | Base layout shell |

## Routing

Routes are defined in `apps/web/src/routes/index.tsx` using `createBrowserRouter`.

**Route categories:**

- **Public**: `/` (landing), `/login`, `/register`, `/pricing`, `/terms`, `/privacy`, SEO pages under `/gestao-financeira-cpf/*`
- **Protected (with onboarding guard)**: `/dashboard`, `/home`, `/transactions`, `/reports`, `/payments`, `/financial-health`
- **Protected (simple)**: `/accounts`, `/credit-cards`, `/budget`, `/goals`, `/statement`, `/openfinance`, `/recurring-transactions`, `/companies`, `/users`, `/profile`, `/settings`, `/import-ofx`, `/insights`, `/planner`, `/ai/classification`, and more
- **Admin (god routes)**: `/admin/openai-logs`, `/admin/plans`

All lazy-loaded page components use `React.lazy()` with named exports. A `preloadProtectedRoutes()` function eagerly loads protected chunks after login.

## State management

| Layer | Tool | Purpose |
| --- | --- | --- |
| Server state | TanStack Query v5 | Data fetching, caching, invalidation |
| Client UI state | Zustand v5 | Sidebar, preferences, theme, maintenance |
| Auth state | Zustand + persist | User, token, isAuthenticated |
| Company state | Zustand + persist | Active company (sanitized, no userIds) |
| Form state | react-hook-form + zod | Validation and form management |
| Local state | useState / useReducer | Component-scoped ephemeral state |

### Zustand stores

| Store | File | Persisted | Purpose |
| --- | --- | --- | --- |
| `useAuthStore` | `stores/auth.ts` | Yes | User, token, authentication state |
| `useCompanyStore` | `stores/company.ts` | Yes | Active company selection |
| `usePreferencesStore` | `stores/preferences.ts` | Yes | User UI preferences |
| `useSidebarStore` | `stores/sidebar.ts` | Yes | Sidebar collapsed state |
| `useThemeStore` | `stores/useTheme.ts` | Yes | Dark/light theme |
| `useTransactionStore` | `stores/transaction.ts` | -- | Transaction UI state |
| `useStatementStore` | `stores/statement.ts` | -- | Statement filters state |
| `useMaintenanceStore` | `stores/maintenance.ts` | No | API maintenance mode detection |
| `useNotificationsStore` | `stores/useNotificationsStore.ts` | -- | In-app notifications |

**Rule**: Server data must NOT be stored in Zustand. Use TanStack Query for server state.

## Data flow

```
Route -> Page -> Custom Hook -> Service (apiClient) -> TanStack Query cache -> UI
                                                                    |
                                                        Zustand (UI state only)
```

## API layer

- Central Axios instance: `services/apiClient.ts`
- Base URL from `VITE_API_URL` env var, with `/v1` suffix
- `withCredentials: true` for HttpOnly cookie auth
- Bearer token header as fallback (transition period)
- Automatic 401 handling with token refresh queue
- Automatic 5xx retry with exponential backoff
- Maintenance mode detection (503, consecutive network errors)
- Separate `refreshClient` to avoid interceptor loops

Feature services live under `services/` and call `apiClient` methods.

## Naming conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| Component | PascalCase | `TransactionCard.tsx` |
| Hook | `use` prefix, camelCase | `useTransactions.ts` |
| Service | camelCase | `transactionService.ts` |
| Store | camelCase | `transaction.ts` |
| Type/Interface | PascalCase | `Transaction.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Page directory | kebab-case | `pages/credit-cards/` |

## New feature flow

1. Add route in `routes/index.tsx` (lazy import, wrapped in `ProtectedLayout`)
2. Create page under `pages/<feature>/` with `index.tsx`, `components/`, `hooks/`
3. Add service methods in `services/<feature>Service.ts`
4. Add TanStack Query hooks in `hooks/` or page-local `hooks/`
5. Compose UI with existing primitives from `components/ui/`
6. Ensure mobile-first, dark mode, loading/error/empty states

See [CREATING_PAGES.md](./CREATING_PAGES.md) for detailed templates.

## Tech stack reference

See [TECH_STACK.md](./TECH_STACK.md) for exact dependency versions.
