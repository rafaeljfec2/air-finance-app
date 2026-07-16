export interface CategoryShareInput {
  readonly name: string;
  readonly value: number;
  readonly color: string;
}

export interface CategoryShare extends CategoryShareInput {
  readonly percentage: number;
}

export function daysElapsedInMonth(date: Date = new Date()): number {
  return Math.max(1, date.getDate());
}

export function expenseDailyAverage(expenses: number, daysElapsed: number): number {
  if (daysElapsed <= 0) {
    return 0;
  }
  return expenses / daysElapsed;
}

export function incomeExpenseBarShares(
  income: number,
  expenses: number,
): { readonly incomeShare: number; readonly expenseShare: number } {
  const total = Math.abs(income) + Math.abs(expenses);
  if (total === 0) {
    return { incomeShare: 0, expenseShare: 0 };
  }
  return {
    incomeShare: Math.abs(income) / total,
    expenseShare: Math.abs(expenses) / total,
  };
}

export function buildCategoryShares(
  categories: readonly CategoryShareInput[],
  totalExpenses: number,
  limit: number,
): readonly CategoryShare[] {
  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, Math.max(0, limit - 1));
  const tail = sorted.slice(Math.max(0, limit - 1));

  const items: CategoryShareInput[] =
    tail.length > 1
      ? [
          ...head,
          {
            name: 'Outros',
            value: tail.reduce((sum, item) => sum + item.value, 0),
            color: '#6B7280',
          },
        ]
      : [...head, ...tail];

  const denominator =
    totalExpenses > 0 ? totalExpenses : items.reduce((sum, item) => sum + item.value, 0);

  return items.map((item) => ({
    ...item,
    percentage: denominator > 0 ? (item.value / denominator) * 100 : 0,
  }));
}

export function countMovements(items: readonly { readonly id: string }[]): number {
  return items.filter((item) => item.id !== 'previous-balance').length;
}
