import { formatCurrency } from '@/utils/formatters';

function pluralDespesa(count: number): string {
  return count === 1 ? 'despesa' : 'despesas';
}

/** Tooltip / aria copy for a calendar day with expenses. */
export function formatExpenseDayTooltip(expenses: number, count: number): string {
  const safeCount = Math.max(0, count);
  return `${formatCurrency(expenses)} · ${safeCount} ${pluralDespesa(safeCount)}`;
}
