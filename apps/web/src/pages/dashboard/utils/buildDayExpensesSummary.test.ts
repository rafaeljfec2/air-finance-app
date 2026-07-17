import { describe, expect, it } from 'vitest';

import type { Account } from '@/services/accountService';
import type { Category } from '@/services/categoryService';
import type { Transaction } from '@/services/transactionService';

import { buildDayExpensesSummary } from './buildDayExpensesSummary';

function makeTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: 'tx',
    description: 'Compra',
    launchType: 'expense',
    valueType: 'variable',
    companyId: 'company-1',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    value: -100,
    paymentDate: '2026-07-18T00:00:00.000Z',
    issueDate: '2026-07-18T00:00:00.000Z',
    quantityInstallments: 1,
    repeatMonthly: false,
    reconciled: true,
    createdAt: '2026-07-18T00:00:00.000Z',
    updatedAt: '2026-07-18T00:00:00.000Z',
    ...overrides,
  } as Transaction;
}

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: 'acc-1',
    name: 'Banco do Brasil',
    type: 'checking',
    color: '#0033AA',
    icon: 'Landmark',
    accountNumber: '00012345',
    ...overrides,
  } as Account;
}

function makeCategory(overrides: Partial<Category>): Category {
  return {
    id: 'cat-1',
    name: 'Compras',
    type: 'expense',
    color: '#8A05BE',
    icon: 'ShoppingCart',
    companyId: 'company-1',
    createdAt: '2026-07-18T00:00:00.000Z',
    updatedAt: '2026-07-18T00:00:00.000Z',
    ...overrides,
  } as Category;
}

describe('buildDayExpensesSummary', () => {
  it('groups expenses by account with subtotals and aggregate totals', () => {
    const transactions = [
      makeTransaction({ id: 'a', accountId: 'acc-1', value: -100 }),
      makeTransaction({ id: 'b', accountId: 'acc-1', value: -50 }),
      makeTransaction({ id: 'c', accountId: 'acc-2', value: -30 }),
    ];
    const accounts = [
      makeAccount({ id: 'acc-1', name: 'Banco do Brasil' }),
      makeAccount({ id: 'acc-2', name: 'Nubank', type: 'credit_card' }),
    ];
    const categories = [makeCategory({ id: 'cat-1' })];

    const summary = buildDayExpensesSummary(transactions, accounts, categories);

    expect(summary.total).toBe(180);
    expect(summary.count).toBe(3);
    expect(summary.accountsUsed).toBe(2);
    expect(summary.average).toBe(60);
    expect(summary.groups).toHaveLength(2);
    expect(summary.groups[0]).toMatchObject({ accountId: 'acc-1', subtotal: 150 });
    expect(summary.groups[0].rows).toHaveLength(2);
    expect(summary.groups[1]).toMatchObject({ accountId: 'acc-2', subtotal: 30 });
  });

  it('ignores revenue transactions', () => {
    const transactions = [
      makeTransaction({ id: 'a', value: -100 }),
      makeTransaction({ id: 'b', launchType: 'revenue', value: 500 }),
    ];

    const summary = buildDayExpensesSummary(transactions, [makeAccount({})], [makeCategory({})]);

    expect(summary.total).toBe(100);
    expect(summary.count).toBe(1);
  });

  it('sorts groups by subtotal desc and rows by amount desc', () => {
    const transactions = [
      makeTransaction({ id: 'a', accountId: 'acc-1', value: -20 }),
      makeTransaction({ id: 'b', accountId: 'acc-1', value: -80 }),
      makeTransaction({ id: 'c', accountId: 'acc-2', value: -200 }),
    ];
    const accounts = [makeAccount({ id: 'acc-1' }), makeAccount({ id: 'acc-2', name: 'Itaú' })];

    const summary = buildDayExpensesSummary(transactions, accounts, [makeCategory({})]);

    expect(summary.groups[0].accountId).toBe('acc-2');
    expect(summary.groups[1].rows[0].amount).toBe(80);
    expect(summary.groups[1].rows[1].amount).toBe(20);
  });

  it('labels credit cards and masks the account number', () => {
    const transactions = [makeTransaction({ accountId: 'card-1', value: -45.8 })];
    const accounts = [
      makeAccount({ id: 'card-1', name: 'Nubank', type: 'credit_card', accountNumber: '99889876' }),
    ];

    const summary = buildDayExpensesSummary(transactions, accounts, [makeCategory({})]);

    expect(summary.groups[0]).toMatchObject({
      kind: 'card',
      kindLabel: 'Cartão',
      paymentMethodLabel: 'Crédito',
      maskedNumber: '•••• 9876',
    });
  });

  it('falls back gracefully for unknown category and account', () => {
    const transactions = [
      makeTransaction({ accountId: 'ghost', categoryId: 'missing', value: -10 }),
    ];

    const summary = buildDayExpensesSummary(transactions, [], []);

    expect(summary.groups).toHaveLength(1);
    expect(summary.groups[0].accountName).toBe('Conta não identificada');
    expect(summary.groups[0].rows[0].categoryName).toBe('Sem categoria');
    expect(summary.groups[0].paymentMethodLabel).toBe('Débito');
  });

  it('returns an empty summary when there are no expenses', () => {
    const summary = buildDayExpensesSummary([], [makeAccount({})], [makeCategory({})]);

    expect(summary).toEqual({
      total: 0,
      count: 0,
      average: 0,
      accountsUsed: 0,
      groups: [],
    });
  });
});
