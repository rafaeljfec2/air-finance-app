import { describe, expect, it } from 'vitest';

import type { CreditCardBill } from '@/types/budget';

import {
  filterCreditCardTransactions,
  isCashDebitTransaction,
  isDebitTransaction,
  isInstallmentTransaction,
  matchesCreditCardGridFilter,
  sumCreditCardTransactions,
} from './creditCardTransactionFilters';

type Transaction = CreditCardBill['transactions'][number];

function buildTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: 'tx-1',
    description: 'Compra',
    value: 100,
    date: '2026-08-01',
    category: 'Compras',
    ...overrides,
  };
}

describe('creditCardTransactionFilters', () => {
  const installment = buildTransaction({
    id: 'installment',
    description: 'Amazon - Parcela 2/3',
    category: 'Parcelado',
    value: 200,
  });
  const finishing = buildTransaction({
    id: 'finishing',
    description: 'Araujo - Parcela 3/3',
    value: 82.68,
  });
  const cash = buildTransaction({
    id: 'cash',
    description: 'Supermercado',
    value: 50,
  });
  const credit = buildTransaction({
    id: 'credit',
    description: 'Pagamento recebido',
    value: 30,
  });

  it('identifies debit transactions excluding credits and reimbursements', () => {
    expect(isDebitTransaction(installment)).toBe(true);
    expect(isDebitTransaction(cash)).toBe(true);
    expect(isDebitTransaction(credit)).toBe(false);
  });

  it('classifies installment transactions by category or description', () => {
    expect(isInstallmentTransaction(installment)).toBe(true);
    expect(isInstallmentTransaction(finishing)).toBe(true);
    expect(isInstallmentTransaction(cash)).toBe(false);
  });

  it('classifies cash debit transactions', () => {
    expect(isCashDebitTransaction(cash)).toBe(true);
    expect(isCashDebitTransaction(installment)).toBe(false);
  });

  it('filters all debit transactions for the invoice filter', () => {
    const transactions = [installment, finishing, cash, credit];
    const filtered = filterCreditCardTransactions(transactions, 'all');

    expect(filtered.map((item) => item.id)).toEqual(['installment', 'finishing', 'cash']);
    expect(sumCreditCardTransactions(filtered)).toBeCloseTo(332.68, 2);
  });

  it('filters installment transactions only', () => {
    const filtered = filterCreditCardTransactions([installment, finishing, cash], 'installment');

    expect(filtered.map((item) => item.id)).toEqual(['installment', 'finishing']);
    expect(matchesCreditCardGridFilter(finishing, 'finishing')).toBe(true);
    expect(matchesCreditCardGridFilter(cash, 'finishing')).toBe(false);
  });

  it('filters cash debit transactions only', () => {
    const filtered = filterCreditCardTransactions([installment, cash], 'cash');

    expect(filtered).toEqual([cash]);
  });

  it('filters finishing installment transactions only', () => {
    const filtered = filterCreditCardTransactions([installment, finishing, cash], 'finishing');

    expect(filtered).toEqual([finishing]);
  });
});
