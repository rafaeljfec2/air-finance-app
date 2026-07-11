import { describe, expect, it } from 'vitest';

import type { OpenFinanceBillView } from './mapOpeniBillsToView';
import { resolveCreditCardsV2FetchPeriod } from './resolveCreditCardsV2FetchPeriod';

describe('resolveCreditCardsV2FetchPeriod', () => {
  it('uses bill due-date window when a bill is selected', () => {
    const bill: OpenFinanceBillView = {
      id: 'bill-old',
      amount: 100,
      currency: 'BRL',
      minimumPayment: 10,
      allowsInstallments: false,
      dueDate: '2025-11-10',
    };

    expect(
      resolveCreditCardsV2FetchPeriod({
        selectedBill: bill,
        preset: 90,
        windowOffset: 0,
        now: new Date('2026-07-11T12:00:00'),
      }),
    ).toEqual({
      startDate: '2025-08-12',
      endDate: '2025-11-17',
    });
  });

  it('uses the free period preset when no bill is selected', () => {
    expect(
      resolveCreditCardsV2FetchPeriod({
        selectedBill: null,
        preset: 30,
        windowOffset: 0,
        now: new Date('2026-07-11T12:00:00'),
      }),
    ).toEqual({
      startDate: '2026-06-12',
      endDate: '2026-07-11',
    });
  });
});
