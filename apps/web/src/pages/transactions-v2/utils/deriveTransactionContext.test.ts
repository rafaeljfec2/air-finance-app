import { describe, expect, it } from 'vitest';

import { buildCategoryMonthCounts, deriveTransactionContext } from './deriveTransactionContext';
import { buildTransaction } from './testTransactionFactory';

describe('deriveTransactionContext', () => {
  it('prioritizes entrada for revenue', () => {
    const tx = buildTransaction({
      id: '1',
      launchType: 'revenue',
      value: 1000,
      repeatMonthly: true,
    });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: '2',
        categoryMonthCount: 5,
        isFirstCategoryPurchaseInMonth: false,
      }),
    ).toEqual({ kind: 'inflow', label: 'Entrada' });
  });

  it('returns recurring subscription for monthly repeats', () => {
    const tx = buildTransaction({
      id: '1',
      repeatMonthly: true,
      value: -49.9,
    });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: null,
        categoryMonthCount: 1,
        isFirstCategoryPurchaseInMonth: true,
      }),
    ).toEqual({ kind: 'recurring', label: 'Assinatura recorrente' });
  });

  it('returns installment context when installments > 1', () => {
    const tx = buildTransaction({
      id: '1',
      quantityInstallments: 12,
      description: 'Notebook 3/12',
      value: -200,
    });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: null,
        categoryMonthCount: 3,
        isFirstCategoryPurchaseInMonth: false,
      }),
    ).toEqual({ kind: 'installment', label: 'Parcela 3 de 12' });
  });

  it('returns biggest expense of the day', () => {
    const tx = buildTransaction({ id: 'exp-1', value: -301 });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: 'exp-1',
        categoryMonthCount: 4,
        isFirstCategoryPurchaseInMonth: false,
      }),
    ).toEqual({ kind: 'biggest-day-expense', label: 'Maior gasto do dia' });
  });

  it('returns first category purchase of the month', () => {
    const tx = buildTransaction({ id: '1', value: -80, categoryId: 'Alimentação' });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: null,
        categoryMonthCount: 1,
        isFirstCategoryPurchaseInMonth: true,
      }),
    ).toEqual({ kind: 'first-category', label: '1ª compra da categoria' });
  });

  it('returns nth purchase of the month for the category', () => {
    const tx = buildTransaction({ id: '1', value: -80, categoryId: 'Alimentação' });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: null,
        categoryMonthCount: 15,
        isFirstCategoryPurchaseInMonth: false,
      }),
    ).toEqual({ kind: 'nth-category', label: '15ª compra este mês' });
  });

  it('returns null when no deterministic evidence applies', () => {
    const tx = buildTransaction({ id: '1', value: -80 });

    expect(
      deriveTransactionContext({
        transaction: tx,
        dayBiggestExpenseId: null,
        categoryMonthCount: 0,
        isFirstCategoryPurchaseInMonth: false,
      }),
    ).toBeNull();
  });
});

describe('buildCategoryMonthCounts', () => {
  it('counts expense purchases by category within month', () => {
    const counts = buildCategoryMonthCounts([
      buildTransaction({
        id: '1',
        categoryId: 'Assinaturas',
        value: -50,
        paymentDate: '2026-07-01T10:00:00.000Z',
      }),
      buildTransaction({
        id: '2',
        categoryId: 'Assinaturas',
        value: -50,
        paymentDate: '2026-07-15T10:00:00.000Z',
      }),
      buildTransaction({
        id: '3',
        categoryId: 'Assinaturas',
        value: -50,
        paymentDate: '2026-06-15T10:00:00.000Z',
      }),
      buildTransaction({
        id: '4',
        categoryId: 'Assinaturas',
        launchType: 'revenue',
        value: 50,
        paymentDate: '2026-07-20T10:00:00.000Z',
      }),
    ]);

    expect(counts.get('2026-07|Assinaturas')).toBe(2);
    expect(counts.get('2026-06|Assinaturas')).toBe(1);
  });
});
