import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';

import { isOpenFinanceConnectedAccount } from './isOpenFinanceConnectedAccount';

function buildAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'acc-1',
    companyId: 'company-1',
    name: 'Card',
    type: 'credit_card',
    color: '#8A05BE',
    icon: 'CreditCard',
    currentBalance: 0,
    bankCurrentBalance: null,
    bankCurrentBalanceDate: null,
    institution: 'Nubank',
    initialBalance: 0,
    initialBalanceDate: null,
    useInitialBalanceInExtract: true,
    useInitialBalanceInCashFlow: true,
    extractBalance: { initial: 0, date: null, enabled: true },
    cashFlowBalance: { initial: 0, date: null, enabled: true },
    hasBankingIntegration: false,
    ...overrides,
  } as Account;
}

describe('isOpenFinanceConnectedAccount', () => {
  it('returns true when the account has an Open Finance item id', () => {
    expect(
      isOpenFinanceConnectedAccount(
        buildAccount({
          openiItemId: 'item-1',
          openiItemStatus: 'CONNECTED',
        }),
      ),
    ).toBe(true);
  });

  it('returns true when banking integration is enabled without explicit error', () => {
    expect(
      isOpenFinanceConnectedAccount(
        buildAccount({
          hasBankingIntegration: true,
          openiItemStatus: 'SYNCED',
        }),
      ),
    ).toBe(true);
  });

  it('returns false for accounts without Open Finance linkage', () => {
    expect(isOpenFinanceConnectedAccount(buildAccount())).toBe(false);
  });

  it('returns false when Open Finance status is ERROR', () => {
    expect(
      isOpenFinanceConnectedAccount(
        buildAccount({
          openiItemId: 'item-1',
          openiItemStatus: 'ERROR',
        }),
      ),
    ).toBe(false);
  });
});
