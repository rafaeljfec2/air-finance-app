import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

import { toTransactionEditPayload } from './toTransactionEditPayload';

function buildTransaction(
  overrides: Partial<TransactionGridTransaction> = {},
): TransactionGridTransaction {
  return {
    id: 'tx-1',
    description: 'Test',
    value: 10,
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'company-1',
    accountId: 'Account Label',
    categoryId: 'Category Label',
    paymentDate: '2026-07-14',
    issueDate: '2026-07-14',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-07-14T00:00:00.000Z',
    updatedAt: '2026-07-14T00:00:00.000Z',
    ...overrides,
  };
}

describe('toTransactionEditPayload', () => {
  it('restores raw account and category ids when labels were applied for display', () => {
    const transaction = buildTransaction({
      accountId: 'Account Label',
      categoryId: 'Category Label',
      rawAccountId: 'acc-123',
      rawCategoryId: 'cat-456',
    });

    const result = toTransactionEditPayload(transaction);

    expect(result.accountId).toBe('acc-123');
    expect(result.categoryId).toBe('cat-456');
  });

  it('keeps current ids when raw ids are absent', () => {
    const transaction = buildTransaction({
      accountId: 'acc-123',
      categoryId: 'cat-456',
    });

    const result = toTransactionEditPayload(transaction);

    expect(result.accountId).toBe('acc-123');
    expect(result.categoryId).toBe('cat-456');
  });
});
