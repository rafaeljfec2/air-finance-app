import { describe, expect, it } from 'vitest';

import { computePeriodTotals } from './computePeriodTotals';
import { buildTransaction } from './testTransactionFactory';

describe('computePeriodTotals', () => {
  it('sums credits and debits ignoring previous balance', () => {
    const totals = computePeriodTotals(
      [
        buildTransaction({ id: 'previous-balance', value: 999, launchType: 'revenue' }),
        buildTransaction({
          id: '1',
          launchType: 'revenue',
          value: 1000,
          rawAccountId: 'acc-1',
        }),
        buildTransaction({ id: '2', launchType: 'expense', value: -300, rawAccountId: 'acc-1' }),
      ],
      new Set(['acc-1']),
      undefined,
    );

    expect(totals).toEqual({ totalCredits: 1000, totalDebits: 300, finalBalance: 700 });
  });

  it('skips non-liquid accounts when no account is selected', () => {
    const totals = computePeriodTotals(
      [
        buildTransaction({ id: '1', launchType: 'expense', value: -300, rawAccountId: 'credit-1' }),
        buildTransaction({ id: '2', launchType: 'expense', value: -50, rawAccountId: 'acc-1' }),
      ],
      new Set(['acc-1']),
      undefined,
    );

    expect(totals).toEqual({ totalCredits: 0, totalDebits: 50, finalBalance: -50 });
  });

  it('counts every transaction when an account is selected', () => {
    const totals = computePeriodTotals(
      [buildTransaction({ id: '1', launchType: 'expense', value: -300, rawAccountId: 'credit-1' })],
      new Set(['acc-1']),
      'credit-1',
    );

    expect(totals).toEqual({ totalCredits: 0, totalDebits: 300, finalBalance: -300 });
  });
});
