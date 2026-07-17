import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';
import type { Transaction } from '@/services/transactionService';

import { isCardRefundTransaction } from './isCardRefundTransaction';

function buildAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'card-1',
    name: 'Card',
    type: 'credit_card',
    extractBalance: { initial: 0, date: null, enabled: true },
    cashFlowBalance: { initial: 0, date: null, enabled: true },
    ...overrides,
  } as Account;
}

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    description: 'Estorno de compra',
    launchType: 'revenue',
    valueType: 'variable',
    companyId: 'company-1',
    accountId: 'card-1',
    categoryId: 'cat-1',
    value: 30,
    paymentDate: '2026-07-07',
    issueDate: '2026-07-07',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: false,
    createdAt: '2026-07-07T00:00:00Z',
    updatedAt: '2026-07-07T00:00:00Z',
    ...overrides,
  };
}

describe('isCardRefundTransaction', () => {
  const cardAccounts = new Set(['card-1']);

  it('returns true for revenue on a credit card that is not a bill payment', () => {
    expect(isCardRefundTransaction(buildTransaction(), cardAccounts)).toBe(true);
  });

  it('returns false for expenses', () => {
    expect(
      isCardRefundTransaction(
        buildTransaction({ launchType: 'expense', value: -50 }),
        cardAccounts,
      ),
    ).toBe(false);
  });

  it('returns false for revenue on non-card accounts', () => {
    expect(
      isCardRefundTransaction(buildTransaction({ accountId: 'checking-1' }), cardAccounts),
    ).toBe(false);
  });

  it('returns false for bill payment credits', () => {
    expect(
      isCardRefundTransaction(
        buildTransaction({ description: 'PAGAMENTO RECEBIDO' }),
        cardAccounts,
      ),
    ).toBe(false);
  });

  it('accepts a card account id set derived from Account[]', () => {
    const accounts = [
      buildAccount({ id: 'card-1' }),
      buildAccount({ id: 'checking-1', type: 'checking' }),
    ];
    const ids = new Set(accounts.filter((a) => a.type === 'credit_card').map((a) => a.id));
    expect(isCardRefundTransaction(buildTransaction(), ids)).toBe(true);
  });
});
