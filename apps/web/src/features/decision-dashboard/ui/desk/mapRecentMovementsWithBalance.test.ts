import { describe, expect, it } from 'vitest';

import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { mapRecentMovementsWithBalance } from './mapRecentMovementsWithBalance';

function buildTx(
  overrides: Partial<TransactionGridTransaction> & Pick<TransactionGridTransaction, 'id'>,
): TransactionGridTransaction {
  return {
    description: 'Test',
    value: -10,
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'c1',
    accountId: 'Conta',
    categoryId: 'Cat',
    paymentDate: '2026-07-10T12:00:00.000Z',
    issueDate: '2026-07-10T12:00:00.000Z',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-07-10T12:00:00.000Z',
    updatedAt: '2026-07-10T12:00:00.000Z',
    ...overrides,
  };
}

describe('mapRecentMovementsWithBalance', () => {
  it('returns newest movements with running balance after each transaction', () => {
    const result = mapRecentMovementsWithBalance({
      transactions: [
        buildTx({
          id: '1',
          description: 'Mercado',
          value: -50,
          paymentDate: '2026-07-02T10:00:00.000Z',
          createdAt: '2026-07-02T10:00:00.000Z',
        }),
        buildTx({
          id: '2',
          description: 'Salário',
          value: 200,
          launchType: 'revenue',
          paymentDate: '2026-07-05T10:00:00.000Z',
          createdAt: '2026-07-05T10:00:00.000Z',
        }),
      ],
      previousBalance: 100,
      startDate: '2026-07-01',
      limit: 4,
    });

    expect(result).toHaveLength(2);
    expect(result[0]?.description).toBe('Salário');
    expect(result[0]?.balanceAfter).toBe(250);
    expect(result[1]?.description).toBe('Mercado');
    expect(result[1]?.balanceAfter).toBe(50);
  });

  it('respects the limit', () => {
    const result = mapRecentMovementsWithBalance({
      transactions: [
        buildTx({ id: '1', paymentDate: '2026-07-01T10:00:00.000Z' }),
        buildTx({ id: '2', paymentDate: '2026-07-02T10:00:00.000Z' }),
        buildTx({ id: '3', paymentDate: '2026-07-03T10:00:00.000Z' }),
      ],
      previousBalance: 0,
      startDate: '2026-07-01',
      limit: 2,
    });

    expect(result).toHaveLength(2);
  });
});
