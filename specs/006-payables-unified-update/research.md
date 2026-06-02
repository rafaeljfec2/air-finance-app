# Research — Payables unified update

## 1. Root cause analysis

### 1.1 TanStack Query `mutate` vs `mutateAsync`

Reference: [TanStack Query v5 — useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

| API | Returns | Awaitable |
| --- | --- | --- |
| `mutate` | `void` | No — callbacks only |
| `mutateAsync` | `Promise<TData>` | Yes |

Current code in both hooks:

```43:61:apps/web/src/components/budget/hooks/useEditableValue.ts
  const saveValue = async (id: string) => {
    // ...
    try {
      await Promise.resolve(
        updateTransaction({
          id,
          data: { value: numericValue },
        }),
      );
```

`updateTransaction` is bound to `mutate`:

```42:48:apps/web/src/hooks/useTransactions.ts
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionPayload> }) =>
      updateTransaction(companyId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });
    },
  });
```

**Conclusion:** success toast and state reset run before the network completes; user perception = "need to do it twice".

### 1.2 Duplicate invalidation

`updateMutation.onSuccess` already invalidates `transactions`. Payables hooks **also** invalidate `transactions` + `budget` manually after the fake await. Budget invalidation is necessary (payables come from budget query); transaction double-invalidation is redundant but harmless.

### 1.3 Credit card payables

`usePayableStatus` blocks toggle when `id.startsWith('card-')`. Credit card bills are display-only in v1; no API maps `card-*` ids to transaction PATCH.

## 2. Alternatives considered

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| **A. `mutateAsync` + unified hook** | Minimal diff; testable; fixes bug | New hook files | **Selected** |
| B. Pass `onSuccess`/`onError` to `mutate` | No new async export | Callback hell; harder to unit test await | Rejected |
| C. Move budget invalidation into `useTransactions.updateMutation` | DRY globally | Every transaction edit invalidates budget (may be desired globally — needs audit) | Deferred v1.1 |
| D. Optimistic updates | Instant UI | Rollback complexity; out of bugfix scope | Out of scope |
| E. Dedicated REST `PATCH /budget/payables/:id` | Domain-specific API | Backend work; overkill | Rejected |

## 3. Existing patterns in repo

- Mutations with async flow: prefer `mutateAsync` or service direct call in other features (e.g. `deleteTransaction: deleteMutation.mutateAsync` already exposed).
- Budget page uses TanStack Query key `['budget', companyId]` — confirmed via `PayablesSection` invalidation pattern.
- SDD/TDD mandatory per `.cursor/rules/sdd-protocol.mdc`.

## 4. References

- TanStack Query v5 mutations: https://tanstack.com/query/latest/docs/framework/react/guides/mutations
- Source: `apps/web/src/components/budget/hooks/useEditableValue.ts`
- Source: `apps/web/src/components/budget/hooks/usePayableStatus.ts`
- Source: `apps/web/src/hooks/useTransactions.ts`
- UI consumer: `apps/web/src/components/budget/sections/PayablesSection.tsx`
- Modal shell: `apps/web/src/components/budget/BudgetExpandedModal.tsx`
