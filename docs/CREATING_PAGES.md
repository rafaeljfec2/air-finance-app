# Creating New Pages

Step-by-step guide for adding pages to the Air Finance web app. For architecture context, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## File structure

```
pages/<feature>/
├── index.tsx                     # Page component
├── components/
│   ├── <Feature>Header.tsx       # Page header with title and actions
│   ├── <Feature>Filters.tsx      # Search and filter controls
│   ├── <Feature>List.tsx         # List/grid rendering
│   ├── <Feature>Card.tsx         # Individual item card
│   ├── <Feature>EmptyState.tsx   # Empty data state
│   └── <Feature>ErrorState.tsx   # Error state
└── hooks/
    ├── use<Feature>Filters.ts    # Filter logic
    └── use<Feature>Sorting.ts    # Sort logic
```

## Step 1: Page component

```tsx
// pages/my-feature/index.tsx
import { ViewDefault } from '@/layouts/ViewDefault';
import { useMyFeature } from '@/hooks/useMyFeature';
import { MyFeatureHeader } from './components/MyFeatureHeader';
import { MyFeatureList } from './components/MyFeatureList';
import { MyFeatureEmptyState } from './components/MyFeatureEmptyState';
import { MyFeatureErrorState } from './components/MyFeatureErrorState';
import { Loading } from '@/components/Loading';

export function MyFeaturePage() {
  const { data, isLoading, error } = useMyFeature();

  if (isLoading) {
    return <ViewDefault><Loading /></ViewDefault>;
  }

  if (error) {
    return <ViewDefault><MyFeatureErrorState error={error} /></ViewDefault>;
  }

  if (!data || data.length === 0) {
    return (
      <ViewDefault>
        <MyFeatureHeader />
        <MyFeatureEmptyState />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <MyFeatureHeader />
      <MyFeatureList items={data} />
    </ViewDefault>
  );
}
```

## Step 2: Data hook (TanStack Query)

```tsx
// hooks/useMyFeature.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as myFeatureService from '@/services/myFeatureService';

export function useMyFeature() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-feature'],
    queryFn: myFeatureService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: myFeatureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
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

## Step 3: Add route

Routes are defined in `apps/web/src/routes/index.tsx`. Protected routes go inside the `ProtectedLayout` children array:

```tsx
// At the top of the file, add the lazy import:
const MyFeaturePage = lazy(() =>
  import('@/pages/my-feature').then((m) => ({ default: m.MyFeaturePage })),
);

// Inside the ProtectedLayout children array:
simpleRoute('/my-feature', <MyFeaturePage />),
```

For routes that require onboarding completion:

```tsx
onboardingRoute('/my-feature', <MyFeaturePage />),
```

**Note**: `ProtectedLayout` already provides `ProtectedRoute`, `ErrorBoundary`, and `Suspense`. Do not re-wrap with these.

## Step 4: Feature components

### Header

```tsx
interface MyFeatureHeaderProps {
  readonly onCreate?: () => void;
}

export function MyFeatureHeader({ onCreate }: MyFeatureHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text dark:text-text-dark">
          My Feature
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your items
        </p>
      </div>
      {onCreate && (
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Item
        </Button>
      )}
    </div>
  );
}
```

### List with grid

```tsx
import { RecordsGrid } from '@/components/ui/RecordsGrid';

interface MyFeatureListProps {
  readonly items: MyFeature[];
}

export function MyFeatureList({ items }: MyFeatureListProps) {
  return (
    <RecordsGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
      {items.map((item) => (
        <MyFeatureCard key={item.id} item={item} />
      ))}
    </RecordsGrid>
  );
}
```

### Empty state

```tsx
export function MyFeatureEmptyState() {
  return (
    <div className="text-center py-12">
      <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400 mb-4">No items found</p>
    </div>
  );
}
```

### Error state

```tsx
interface MyFeatureErrorStateProps {
  readonly error: Error | unknown;
  readonly onRetry?: () => void;
}

export function MyFeatureErrorState({ error, onRetry }: MyFeatureErrorStateProps) {
  const message = error instanceof Error ? error.message : 'Failed to load data';
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && <Button onClick={onRetry} variant="outline">Retry</Button>}
    </div>
  );
}
```

## Page checklist

### Structure
- [ ] Page in `pages/<feature>/index.tsx`
- [ ] Sub-components in `pages/<feature>/components/`
- [ ] Custom hooks in `pages/<feature>/hooks/`
- [ ] Route added in `routes/index.tsx` (inside `ProtectedLayout`)

### Functionality
- [ ] Uses `ViewDefault` as wrapper
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state implemented
- [ ] CRUD operations via TanStack Query mutations (if applicable)

### UI/UX
- [ ] Mobile-first Tailwind classes (base -> `sm:` -> `md:` -> `lg:`)
- [ ] Touch targets >= 44x44px
- [ ] Dark mode support (`dark:` variants)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Toast feedback for user actions (via `sonner`)

### Code quality
- [ ] TypeScript strict (no `any`)
- [ ] Props marked as `readonly`
- [ ] ESLint passes (`yarn lint`)
- [ ] TypeScript passes (`yarn typecheck`)

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) -- monorepo structure and routing
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) -- colors, components, spacing
- [MOBILE_FIRST_GUIDE.md](./MOBILE_FIRST_GUIDE.md) -- responsive patterns
