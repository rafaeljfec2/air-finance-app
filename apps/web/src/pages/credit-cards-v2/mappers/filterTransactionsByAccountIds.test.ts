import { describe, expect, it } from 'vitest';

import type { Transaction } from '@/services/transactionService';

import { filterTransactionsByAccountIds } from './filterTransactionsByAccountIds';

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

describe('filterTransactionsByAccountIds', () => {
  it('keeps only transactions whose accountId is in the set', () => {
    const cardOnly = buildTransaction({ id: 'a', accountId: 'card-1' });
    const otherCard = buildTransaction({ id: 'b', accountId: 'card-2' });
    const bank = buildTransaction({ id: 'c', accountId: 'checking-1' });

    const result = filterTransactionsByAccountIds([cardOnly, otherCard, bank], new Set(['card-1']));

    expect(result).toEqual([cardOnly]);
  });

  it('keeps transactions from multiple allowed account ids', () => {
    const card1 = buildTransaction({ id: 'a', accountId: 'card-1' });
    const card2 = buildTransaction({ id: 'b', accountId: 'card-2' });
    const bank = buildTransaction({ id: 'c', accountId: 'checking-1' });

    const result = filterTransactionsByAccountIds(
      [card1, card2, bank],
      new Set(['card-1', 'card-2']),
    );

    expect(result).toEqual([card1, card2]);
  });

  it('returns an empty array when the account set is empty', () => {
    const result = filterTransactionsByAccountIds(
      [buildTransaction({ accountId: 'card-1' })],
      new Set(),
    );

    expect(result).toEqual([]);
  });

  it('returns an empty array when there are no transactions', () => {
    expect(filterTransactionsByAccountIds([], new Set(['card-1']))).toEqual([]);
  });
});
