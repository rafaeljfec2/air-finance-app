import { describe, expect, it } from 'vitest';

import {
  buildDayNarrative,
  buildDayNarrativesByKey,
  resolvePeriodEndBalance,
} from './buildDayNarrative';
import { buildTransaction } from './testTransactionFactory';

describe('buildDayNarrative', () => {
  it('summarizes movements, outflows, biggest expense and end-of-day balance', () => {
    const transactions = [
      buildTransaction({
        id: '1',
        description: 'Cursor IDE',
        value: -301,
        launchType: 'expense',
        paymentDate: '2026-07-14T18:00:00.000Z',
        createdAt: '2026-07-14T18:00:00.000Z',
        balance: 10591.13,
      }),
      buildTransaction({
        id: '2',
        description: 'Cafe',
        value: -12.5,
        launchType: 'expense',
        paymentDate: '2026-07-14T10:00:00.000Z',
        createdAt: '2026-07-14T10:00:00.000Z',
        balance: 10892.13,
      }),
      buildTransaction({
        id: '3',
        description: 'Salary',
        value: 1000,
        launchType: 'revenue',
        paymentDate: '2026-07-14T08:00:00.000Z',
        createdAt: '2026-07-14T08:00:00.000Z',
        balance: 10904.63,
      }),
    ];

    const narrative = buildDayNarrative('2026-07-14', transactions);

    expect(narrative.dayKey).toBe('2026-07-14');
    expect(narrative.movementCount).toBe(3);
    expect(narrative.totalOutflows).toBe(313.5);
    expect(narrative.totalInflows).toBe(1000);
    expect(narrative.hasInflow).toBe(true);
    expect(narrative.biggestExpense).toEqual({
      description: 'Cursor IDE',
      absValue: 301,
    });
    expect(narrative.endOfDayBalance).toBe(10591.13);
  });

  it('ignores previous-balance rows and returns zeroed narrative for empty day', () => {
    const narrative = buildDayNarrative('previous-balance', [
      buildTransaction({
        id: 'previous-balance',
        description: 'SALDO ANTERIOR',
        value: 500,
        balance: 500,
      }),
    ]);

    expect(narrative.movementCount).toBe(0);
    expect(narrative.totalOutflows).toBe(0);
    expect(narrative.biggestExpense).toBeNull();
    expect(narrative.endOfDayBalance).toBeNull();
    expect(narrative.hasInflow).toBe(false);
  });

  it('maps narratives by day key from a full list', () => {
    const map = buildDayNarrativesByKey([
      buildTransaction({
        id: '1',
        paymentDate: '2026-07-14T12:00:00.000Z',
        value: -50,
        balance: 100,
      }),
      buildTransaction({
        id: '2',
        paymentDate: '2026-07-13T12:00:00.000Z',
        value: -20,
        balance: 150,
      }),
    ]);

    expect(map.get('2026-07-14')?.movementCount).toBe(1);
    expect(map.get('2026-07-13')?.movementCount).toBe(1);
  });
});

describe('resolvePeriodEndBalance', () => {
  it('returns the balance of the chronologically last transaction', () => {
    const balance = resolvePeriodEndBalance([
      buildTransaction({
        id: '1',
        paymentDate: '2026-07-10T12:00:00.000Z',
        createdAt: '2026-07-10T12:00:00.000Z',
        balance: 200,
      }),
      buildTransaction({
        id: '2',
        paymentDate: '2026-07-14T12:00:00.000Z',
        createdAt: '2026-07-14T12:00:00.000Z',
        balance: 10591.13,
      }),
      buildTransaction({
        id: '3',
        paymentDate: '2026-07-12T12:00:00.000Z',
        createdAt: '2026-07-12T12:00:00.000Z',
        balance: 500,
      }),
    ]);

    expect(balance).toBe(10591.13);
  });

  it('returns null for an empty list or when balances are missing', () => {
    expect(resolvePeriodEndBalance([])).toBeNull();
    expect(resolvePeriodEndBalance([buildTransaction({ id: '1' })])).toBeNull();
  });
});
