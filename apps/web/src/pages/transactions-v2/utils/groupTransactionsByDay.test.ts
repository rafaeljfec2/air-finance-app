import { describe, expect, it } from 'vitest';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { getTransactionDayKey, groupTransactionsByDay } from './groupTransactionsByDay';

function buildTransaction(
  overrides: Partial<TransactionGridTransaction> & Pick<TransactionGridTransaction, 'id'>,
): TransactionGridTransaction {
  return {
    description: 'Test',
    value: 100,
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'c1',
    accountId: 'Conta',
    categoryId: 'Cat',
    paymentDate: '2026-03-10T00:00:00.000Z',
    issueDate: '2026-03-10T00:00:00.000Z',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z',
    ...overrides,
  };
}

describe('groupTransactionsByDay', () => {
  it('groups transactions by payment date in descending order', () => {
    const groups = groupTransactionsByDay([
      buildTransaction({ id: '1', paymentDate: '2026-03-10T00:00:00.000Z' }),
      buildTransaction({ id: '2', paymentDate: '2026-03-10T12:00:00.000Z' }),
      buildTransaction({ id: '3', paymentDate: '2026-03-09T00:00:00.000Z' }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]?.dayKey).toBe('2026-03-10');
    expect(groups[1]?.dayKey).toBe('2026-03-09');
    expect(groups[0]?.transactions.map((tx) => tx.id)).toEqual(['2', '1']);
  });

  it('places previous balance after dated groups', () => {
    const groups = groupTransactionsByDay([
      buildTransaction({ id: 'previous-balance', description: 'Saldo anterior', value: 500 }),
      buildTransaction({ id: '1', paymentDate: '2026-03-10T00:00:00.000Z' }),
    ]);

    expect(groups[0]?.dayKey).toBe('2026-03-10');
    expect(groups[1]?.dayKey).toBe('previous-balance');
  });

  it('extracts stable day keys from ISO dates', () => {
    expect(getTransactionDayKey(buildTransaction({ id: '1' }))).toBe('2026-03-10');
  });
});
