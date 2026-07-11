import { describe, expect, it } from 'vitest';

import {
  filterTransactionsByBillId,
  formatOpenFinanceBillLabel,
} from './filterTransactionsByBillId';
import type { StatementTransactionItem } from './mapOpeniTransactionToStatementItem';

const tx = (
  overrides: Partial<StatementTransactionItem> & Pick<StatementTransactionItem, 'id' | 'billId'>,
): StatementTransactionItem => ({
  date: '2026-01-01',
  description: 'Item',
  amount: -10,
  type: 'DEBIT',
  status: 'POSTED',
  ...overrides,
});

describe('filterTransactionsByBillId', () => {
  it('returns all transactions when billId is null', () => {
    const items = [tx({ id: '1', billId: 'a' }), tx({ id: '2', billId: null })];
    expect(filterTransactionsByBillId(items, null)).toHaveLength(2);
  });

  it('keeps only transactions matching the selected bill', () => {
    const items = [
      tx({ id: '1', billId: 'bill-a' }),
      tx({ id: '2', billId: 'bill-b' }),
      tx({ id: '3', billId: null }),
    ];
    expect(filterTransactionsByBillId(items, 'bill-a').map((item) => item.id)).toEqual(['1']);
  });
});

describe('formatOpenFinanceBillLabel', () => {
  it('formats due date label with fatura prefix', () => {
    const label = formatOpenFinanceBillLabel({
      id: 'b1',
      amount: 100,
      currency: 'BRL',
      minimumPayment: 20,
      allowsInstallments: false,
      dueDate: '2026-03-15',
    });
    expect(label.startsWith('Fatura · vence ')).toBe(true);
    expect(label).toContain('15');
    expect(label).toContain('2026');
  });
});
