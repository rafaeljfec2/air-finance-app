import type { CompletePlanInstallment } from '@/services/completePlanService';

export const INSTALLMENTS_VISIBLE_HIGH_MEDIUM_MAX = 3;

export function partitionInstallmentsHeadAndRest(items: readonly CompletePlanInstallment[]): {
  head: CompletePlanInstallment[];
  rest: CompletePlanInstallment[];
} {
  const head: CompletePlanInstallment[] = [];
  const usedIndex = new Set<number>();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (
      head.length < INSTALLMENTS_VISIBLE_HIGH_MEDIUM_MAX &&
      (item.priority === 'high' || item.priority === 'medium')
    ) {
      head.push(item);
      usedIndex.add(i);
    }
  }
  const rest = items.filter((_, index) => !usedIndex.has(index));
  return { head, rest };
}
