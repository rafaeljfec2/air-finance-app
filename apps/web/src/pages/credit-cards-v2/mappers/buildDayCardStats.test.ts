import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';
import type { Transaction } from '@/services/transactionService';

import { buildDayCardStats } from './buildDayCardStats';

function buildAccount(id: string, type: Account['type']): Account {
  return {
    id,
    name: `Account ${id}`,
    type,
    extractBalance: { initial: 0, date: null, enabled: true },
    cashFlowBalance: { initial: 0, date: null, enabled: true },
  } as Account;
}

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).slice(2)}`,
    description: 'Expense',
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'company-1',
    accountId: 'card-1',
    categoryId: 'cat-1',
    value: 50,
    paymentDate: '2026-07-18',
    issueDate: '2026-07-18',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-07-18T00:00:00Z',
    updatedAt: '2026-07-18T00:00:00Z',
    ...overrides,
  };
}

const ACCOUNTS = [
  buildAccount('card-1', 'credit_card'),
  buildAccount('card-2', 'credit_card'),
  buildAccount('checking-1', 'checking'),
];

describe('buildDayCardStats', () => {
  it('totals expenses, card usage, installments and refunds for the day', () => {
    const stats = buildDayCardStats(
      [
        buildTransaction({ accountId: 'card-1', value: 100 }),
        buildTransaction({ accountId: 'card-2', value: -46.75 }),
        buildTransaction({ accountId: 'checking-1', value: 50 }),
        buildTransaction({ accountId: 'card-1', value: 90, quantityInstallments: 3 }),
        buildTransaction({ accountId: 'card-2', launchType: 'revenue', value: 30 }),
      ],
      ACCOUNTS,
    );

    expect(stats.expensesTotal).toBeCloseTo(286.75);
    expect(stats.expensesCount).toBe(4);
    expect(stats.cardsTotal).toBeCloseTo(236.75);
    expect(stats.cardsCount).toBe(2);
    expect(stats.installmentsTotal).toBe(90);
    expect(stats.installmentsCount).toBe(1);
    expect(stats.refundsTotal).toBe(30);
    expect(stats.refundsCount).toBe(1);
  });

  it('returns zeroed stats for an empty day', () => {
    const stats = buildDayCardStats([], ACCOUNTS);

    expect(stats).toEqual({
      expensesTotal: 0,
      expensesCount: 0,
      cardsTotal: 0,
      cardsCount: 0,
      installmentsTotal: 0,
      installmentsCount: 0,
      refundsTotal: 0,
      refundsCount: 0,
    });
  });

  it('does not count revenues on non-card accounts as refunds', () => {
    const stats = buildDayCardStats(
      [buildTransaction({ accountId: 'checking-1', launchType: 'revenue', value: 30 })],
      ACCOUNTS,
    );

    expect(stats.refundsCount).toBe(0);
    expect(stats.refundsTotal).toBe(0);
  });
});
