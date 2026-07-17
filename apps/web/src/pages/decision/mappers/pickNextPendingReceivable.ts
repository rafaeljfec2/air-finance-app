import type { Receivable } from '@/types/budget';

export interface NextReceivableView {
  readonly description: string;
  readonly value: number;
  readonly dueDate: string;
}

/**
 * Earliest PENDING receivable by due date (SPEC-08 "próxima entrada").
 */
export function pickNextPendingReceivable(
  receivables: readonly Receivable[],
): NextReceivableView | null {
  const pending = receivables.filter((item) => item.status === 'PENDING');
  if (pending.length === 0) {
    return null;
  }
  const sorted = [...pending].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const next = sorted[0];
  if (next === undefined) {
    return null;
  }
  return {
    description: next.description,
    value: next.value,
    dueDate: next.dueDate,
  };
}

export function formatDueDatePt(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) {
    return iso;
  }
  const day = Number(match[3]);
  const monthIndex = Number(match[2]) - 1;
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ] as const;
  const monthName = months[monthIndex] ?? match[2];
  return `dia ${day} de ${monthName}`;
}
