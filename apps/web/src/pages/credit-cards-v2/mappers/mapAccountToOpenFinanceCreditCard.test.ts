import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';

import {
  mapAccountToOpenFinanceCreditCard,
  mapAccountsToOpenFinanceCreditCards,
} from './mapAccountToOpenFinanceCreditCard';

function buildAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'acc-mongo-1',
    name: 'Cartão Nubank',
    type: 'credit_card',
    extractBalance: { initial: 0, date: null, enabled: true },
    cashFlowBalance: { initial: 0, date: null, enabled: true },
    bankDetails: { accountNumber: '1234567890' },
    integration: {
      enabled: true,
      openFinance: {
        itemId: 'item-1',
        accountId: 'openi-card-1',
        status: 'CONNECTED',
      },
    },
    ...overrides,
  } as Account;
}

describe('mapAccountToOpenFinanceCreditCard', () => {
  it('maps open finance credit card account', () => {
    expect(mapAccountToOpenFinanceCreditCard(buildAccount())).toEqual({
      id: 'acc-mongo-1',
      openiCardId: 'openi-card-1',
      itemId: 'item-1',
      name: 'Cartão Nubank',
      digits: '7890',
      status: 'CONNECTED',
      color: '#8A05BE',
    });
  });

  it('returns null for checking accounts', () => {
    expect(mapAccountToOpenFinanceCreditCard(buildAccount({ type: 'checking' }))).toBeNull();
  });

  it('returns null when open finance ids are missing', () => {
    expect(
      mapAccountToOpenFinanceCreditCard(
        buildAccount({
          integration: { enabled: true, openFinance: { itemId: 'item-1' } },
        }),
      ),
    ).toBeNull();
  });

  it('filters list to open finance credit cards only', () => {
    const cards = mapAccountsToOpenFinanceCreditCards([
      buildAccount(),
      buildAccount({ id: 'checking', type: 'checking' }),
      buildAccount({
        id: 'manual-card',
        integration: { enabled: false },
        openiItemId: undefined,
      }),
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.id).toBe('acc-mongo-1');
  });
});
