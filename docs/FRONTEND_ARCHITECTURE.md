# Frontend Architecture -- Air Finance

Deep dive into `@air-finance/web` patterns. For the high-level monorepo overview, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Data flow

```
User Action -> Page Component -> Custom Hook -> Service (apiClient) -> TanStack Query -> UI
                                                                               |
                                                                   Zustand (UI state only)
```

- **Pages** orchestrate feature components and hooks
- **Custom hooks** encapsulate data fetching (TanStack Query) and business logic
- **Services** handle HTTP via `apiClient` (Axios with interceptors)
- **Zustand** stores hold UI-only state (sidebar, theme, preferences)
- **react-hook-form + zod** manage form state and validation

## Layouts

### ProtectedLayout

Wraps all authenticated routes. Provides:
- `ProtectedRoute` (auth guard with redirect to `/login`)
- `ErrorBoundary` (catch rendering errors)
- `Suspense` with `SuspenseLoader` (code-splitting fallback)
- `AnnouncementsProvider` (in-app announcements)

### ViewDefault

Main application chrome for authenticated pages:

**Desktop (lg: 1024px+)**
```
+------------------------------------------+
|               Header                      |
+----------+-------------------------------+
|          |                               |
| Sidebar  |       Main Content            |
| (fixed)  |       (scrollable)            |
|          |                               |
+----------+-------------------------------+
```

**Mobile (< lg)**
```
+---------------------+
|       Header        |
+---------------------+
|                     |
|    Main Content     |
|    (scrollable)     |
|                     |
+---------------------+
  [MobileBottomNav]
```

Features:
- Collapsible sidebar (persisted via `useSidebarStore`)
- Header visibility toggle (persisted via `usePreferencesStore`)
- `CompanySelectionModal` for multi-company switching
- `TransactionTypeModal` for quick transaction creation
- `MobileBottomNav` for mobile navigation
- Safe area support for notch devices

### LayoutAuth

Minimal layout for public auth pages (login, signup, forgot-password).

## Page structure convention

```
pages/<feature>/
├── index.tsx                    # Page component (uses ViewDefault)
├── components/
│   ├── <Feature>Header.tsx
│   ├── <Feature>Filters.tsx
│   ├── <Feature>List.tsx
│   ├── <Feature>Card.tsx
│   ├── <Feature>EmptyState.tsx
│   └── <Feature>ErrorState.tsx
└── hooks/
    ├── use<Feature>Filters.ts
    └── use<Feature>Sorting.ts
```

Every page must:
1. Be wrapped in `ViewDefault` (within `ProtectedLayout`)
2. Handle loading, error, and empty states
3. Use mobile-first Tailwind classes
4. Support dark mode with `dark:` variants

See [CREATING_PAGES.md](./CREATING_PAGES.md) for templates.

## Component categories

| Category | Location | Description |
| --- | --- | --- |
| UI primitives | `components/ui/` | Button, Input, Card, Badge, Modal, RecordsGrid, RecordCard, SortableColumn |
| Layout chrome | `components/layout/` | Header, Sidebar, MobileBottomNav, NavigationGroup |
| Feature components | `components/<feature>/` or `pages/<feature>/components/` | Domain-specific UI |
| Page components | `pages/<feature>/index.tsx` | Route entry points |

## Component structure pattern

```tsx
// 1. Imports (grouped: react, external, internal)
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useMyHook } from '@/hooks/useMyHook';

// 2. Props interface (readonly)
interface MyComponentProps {
  readonly title: string;
  readonly onAction: () => void;
}

// 3. Component (named export)
export function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks first
  const [state, setState] = useState();
  const { data } = useMyHook();

  // Handlers
  const handleClick = useCallback(() => { /* ... */ }, []);

  // Render
  return <div>{/* JSX */}</div>;
}
```

## Custom hooks pattern

```tsx
// hooks/useFeatureData.ts
export function useFeatureData() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['feature'],
    queryFn: featureService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: featureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature'] });
    },
  });

  return {
    items: data ?? [],
    isLoading,
    error,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
```

## Safe areas (iOS/Android)

The project supports device safe areas for notch, status bar, and gesture indicators.

**Configuration**: `viewport-fit=cover` in `index.html`; CSS variables in `src/index.css`:

```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
}
```

**Utility classes** (defined in Tailwind config):

| Type | Classes |
| --- | --- |
| Padding | `pt-safe`, `pb-safe`, `pl-safe`, `pr-safe`, `px-safe`, `py-safe`, `p-safe` |
| Margin | `mt-safe`, `mb-safe` |
| Position | `top-safe`, `bottom-safe`, `left-safe`, `right-safe`, `inset-safe` |
| Position + offset | `top-safe-4`, `bottom-safe-6`, `right-safe-4` |

**Rule**: Always use safe area classes on `fixed` or viewport-relative `absolute` elements.

**Hook**: `useSafeArea()` returns `{ top, right, bottom, left }` values in pixels.

Components with built-in safe area support: ViewDefault, Sidebar, Modal, ConfirmModal, TransactionTypeModal, NotificationsMenu, UserMenu, StatementFilters.

## SEO

`react-helmet-async` provides metadata for SEO pages under `pages/seo/`. Public landing pages also use helmet for title and description.

## Performance patterns

- Lazy loading via `React.lazy()` for all page components
- `preloadProtectedRoutes()` eagerly loads protected chunks post-login
- `react-window` for large list virtualization
- `react-intersection-observer` for lazy rendering
- `useMemo` / `useCallback` for expensive computations and stable references
- Tailwind CSS purges unused styles in production

## Error handling

- `ErrorBoundary` at `ProtectedLayout` level catches render errors
- `ErrorPage` component for 404 and 500 error routes
- Per-page error states in feature components
- API errors surface via `apiClient` interceptors (see [AUTH_SESSION_IMPLEMENTATION.md](./AUTH_SESSION_IMPLEMENTATION.md))
- Toast notifications via `sonner` for user feedback
