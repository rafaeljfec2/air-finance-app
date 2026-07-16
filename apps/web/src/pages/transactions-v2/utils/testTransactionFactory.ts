import type { TransactionGridTransaction } from '@/components/transactions/TransactionGrid.types';

export function buildTransaction(
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
