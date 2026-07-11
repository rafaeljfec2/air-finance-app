import { describe, expect, it } from 'vitest';

import type { OpeniCreditCardDetailsPayload } from '@/services/openiService';

import { mapOpeniBillsToView, sortOpeniBillsByDueDateDesc } from './mapOpeniBillsToView';

const baseBill: OpeniCreditCardDetailsPayload['bills'][number] = {
  id: 'bill-1',
  amount: 11227.17,
  currency: 'BRL',
  minimumPayment: 2097,
  allowsInstallments: true,
  dueDate: '2026-08-06T00:00:00.000Z',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

describe('mapOpeniBillsToView', () => {
  it('maps open finance bill fields for display', () => {
    expect(mapOpeniBillsToView([baseBill])[0]).toEqual({
      id: 'bill-1',
      amount: 11227.17,
      currency: 'BRL',
      minimumPayment: 2097,
      allowsInstallments: true,
      dueDate: '2026-08-06T00:00:00.000Z',
    });
  });

  it('sorts bills by due date descending', () => {
    const sorted = sortOpeniBillsByDueDateDesc([
      { ...baseBill, id: 'older', dueDate: '2026-06-06T00:00:00.000Z' },
      { ...baseBill, id: 'newer', dueDate: '2026-08-06T00:00:00.000Z' },
    ]);

    expect(sorted.map((b) => b.id)).toEqual(['newer', 'older']);
  });
});
