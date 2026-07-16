import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';
import {
  calculateBalance,
  createPreviousBalanceRow,
} from '@/components/transactions/TransactionGrid.utils';

export interface DeskRecentMovement {
  readonly id: string;
  readonly description: string;
  readonly categoryLabel: string;
  readonly accountLabel: string;
  readonly value: number;
  readonly launchType: 'revenue' | 'expense';
  readonly paymentDate: string;
  readonly balanceAfter: number;
}

interface MapRecentMovementsWithBalanceParams {
  readonly transactions: readonly TransactionGridTransaction[];
  readonly previousBalance: number;
  readonly startDate: string;
  readonly limit: number;
}

export function mapRecentMovementsWithBalance({
  transactions,
  previousBalance,
  startDate,
  limit,
}: MapRecentMovementsWithBalanceParams): readonly DeskRecentMovement[] {
  const withPrevious = [createPreviousBalanceRow(previousBalance, startDate), ...transactions];
  const withBalance = calculateBalance(withPrevious);

  return withBalance
    .filter((tx) => tx.id !== 'previous-balance')
    .sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.createdAt).getTime();
      const dateB = new Date(b.paymentDate || b.createdAt).getTime();
      if (dateA === dateB) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return dateB - dateA;
    })
    .slice(0, limit)
    .map((tx) => ({
      id: tx.id,
      description: tx.description,
      categoryLabel: tx.categoryId || 'Sem categoria',
      accountLabel: tx.accountId || 'Sem conta',
      value: tx.value,
      launchType: tx.launchType === 'revenue' ? 'revenue' : 'expense',
      paymentDate: tx.paymentDate || tx.createdAt,
      balanceAfter: tx.balance ?? 0,
    }));
}
