import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { getTransactionDayKey } from './groupTransactionsByDay';

export type TransactionContextKind =
  | 'inflow'
  | 'recurring'
  | 'installment'
  | 'biggest-day-expense'
  | 'first-category'
  | 'nth-category';

export interface TransactionContext {
  readonly kind: TransactionContextKind;
  readonly label: string;
}

export interface DeriveTransactionContextInput {
  readonly transaction: TransactionGridTransaction;
  readonly dayBiggestExpenseId: string | null;
  readonly categoryMonthCount: number;
  readonly isFirstCategoryPurchaseInMonth: boolean;
}

function extractInstallmentLabel(description: string, quantityInstallments: number): string | null {
  if (quantityInstallments <= 1) {
    return null;
  }

  const match = description.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    const current = Number(match[1]);
    const total = Number(match[2]);
    if (Number.isFinite(current) && Number.isFinite(total) && total > 1) {
      return `Parcela ${current} de ${total}`;
    }
  }

  return `Parcela 1 de ${quantityInstallments}`;
}

function formatOrdinal(count: number): string {
  return `${count}ª`;
}

export function deriveTransactionContext(
  input: DeriveTransactionContextInput,
): TransactionContext | null {
  const { transaction, dayBiggestExpenseId, categoryMonthCount, isFirstCategoryPurchaseInMonth } =
    input;

  if (transaction.id === 'previous-balance') {
    return null;
  }

  if (transaction.launchType === 'revenue' || transaction.value > 0) {
    return { kind: 'inflow', label: 'Entrada' };
  }

  if (transaction.repeatMonthly) {
    return { kind: 'recurring', label: 'Assinatura recorrente' };
  }

  const installmentLabel = extractInstallmentLabel(
    transaction.description,
    transaction.quantityInstallments,
  );
  if (installmentLabel) {
    return { kind: 'installment', label: installmentLabel };
  }

  if (dayBiggestExpenseId && transaction.id === dayBiggestExpenseId) {
    return { kind: 'biggest-day-expense', label: 'Maior gasto do dia' };
  }

  if (isFirstCategoryPurchaseInMonth && categoryMonthCount >= 1) {
    return { kind: 'first-category', label: '1ª compra da categoria' };
  }

  if (categoryMonthCount >= 2) {
    return {
      kind: 'nth-category',
      label: `${formatOrdinal(categoryMonthCount)} compra este mês`,
    };
  }

  return null;
}

export function buildCategoryMonthCounts(
  transactions: readonly TransactionGridTransaction[],
): Map<string, number> {
  const counts = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.id === 'previous-balance') return;
    if (transaction.launchType === 'revenue' || transaction.value > 0) return;

    const category = transaction.categoryId || 'Sem categoria';
    const monthKey = getTransactionDayKey(transaction).slice(0, 7);
    const key = `${monthKey}|${category}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

export function getCategoryMonthKey(transaction: TransactionGridTransaction): string {
  const category = transaction.categoryId || 'Sem categoria';
  const monthKey = getTransactionDayKey(transaction).slice(0, 7);
  return `${monthKey}|${category}`;
}

export function countCategoryPurchasesUpToTransaction(
  transactions: readonly TransactionGridTransaction[],
  target: TransactionGridTransaction,
): { readonly count: number; readonly isFirst: boolean } {
  if (target.launchType === 'revenue' || target.value > 0) {
    return { count: 0, isFirst: false };
  }

  const category = target.categoryId || 'Sem categoria';
  const monthKey = getTransactionDayKey(target).slice(0, 7);
  const targetTime = new Date(target.paymentDate || target.createdAt).getTime();
  const targetCreated = new Date(target.createdAt).getTime();

  const sameCategoryInMonth = transactions
    .filter((transaction) => {
      if (transaction.id === 'previous-balance') return false;
      if (transaction.launchType === 'revenue' || transaction.value > 0) return false;
      if ((transaction.categoryId || 'Sem categoria') !== category) return false;
      return getTransactionDayKey(transaction).slice(0, 7) === monthKey;
    })
    .sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.createdAt).getTime();
      const dateB = new Date(b.paymentDate || b.createdAt).getTime();
      if (dateA === dateB) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return dateA - dateB;
    });

  let count = 0;
  for (const transaction of sameCategoryInMonth) {
    const time = new Date(transaction.paymentDate || transaction.createdAt).getTime();
    const created = new Date(transaction.createdAt).getTime();
    if (time < targetTime || (time === targetTime && created <= targetCreated)) {
      count += 1;
    }
  }

  return {
    count,
    isFirst: count === 1,
  };
}
