import { describe, expect, it } from 'vitest';

import type { OpeniCreditCardTransactionsPayload } from '@/services/openiService';

import {
  mapOpeniTransactionToStatementItem,
  mapOpeniTransactionsToStatementItems,
} from './mapOpeniTransactionToStatementItem';

const baseTx: OpeniCreditCardTransactionsPayload['transactions'][number] = {
  id: 'tx-1',
  accountId: 'acc-1',
  billId: null,
  description: 'Posto Tatiana',
  descriptionRaw: 'Posto Tatiana RAW',
  status: 'PENDING',
  type: 'DEBIT',
  operationType: null,
  amount: 128.8,
  amountInAccountCurrency: null,
  currency: 'BRL',
  cardNumber: null,
  installmentNumber: null,
  installmentTotal: null,
  transactionAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
  createdAt: '2026-07-01T12:00:00.000Z',
};

describe('mapOpeniTransactionToStatementItem', () => {
  it('maps debit pending transaction without installment', () => {
    const item = mapOpeniTransactionToStatementItem(baseTx);

    expect(item).toEqual({
      id: 'tx-1',
      date: '2026-07-01T12:00:00.000Z',
      description: 'Posto Tatiana',
      amount: 128.8,
      type: 'DEBIT',
      status: 'PENDING',
      installment: undefined,
      billId: null,
    });
  });

  it('maps credit posted transaction', () => {
    const item = mapOpeniTransactionToStatementItem({
      ...baseTx,
      id: 'tx-2',
      description: 'Payment received',
      status: 'POSTED',
      type: 'CREDIT',
      amount: 500,
      billId: 'bill-1',
    });

    expect(item.status).toBe('POSTED');
    expect(item.type).toBe('CREDIT');
    expect(item.amount).toBe(500);
  });

  it('formats installment as n/total when both present', () => {
    const item = mapOpeniTransactionToStatementItem({
      ...baseTx,
      installmentNumber: 1,
      installmentTotal: 12,
    });

    expect(item.installment).toBe('1/12');
  });

  it('omits installment when number or total is null', () => {
    expect(
      mapOpeniTransactionToStatementItem({
        ...baseTx,
        installmentNumber: 1,
        installmentTotal: null,
      }).installment,
    ).toBeUndefined();

    expect(
      mapOpeniTransactionToStatementItem({
        ...baseTx,
        installmentNumber: null,
        installmentTotal: 12,
      }).installment,
    ).toBeUndefined();
  });

  it('falls back to descriptionRaw when description is empty', () => {
    const item = mapOpeniTransactionToStatementItem({
      ...baseTx,
      description: '',
      descriptionRaw: 'Raw merchant',
    });

    expect(item.description).toBe('Raw merchant');
  });

  it('uses placeholder when both descriptions are empty', () => {
    const item = mapOpeniTransactionToStatementItem({
      ...baseTx,
      description: '',
      descriptionRaw: '',
    });

    expect(item.description).toBe('Sem descrição');
  });

  it('maps a list and sorts by date descending', () => {
    const items = mapOpeniTransactionsToStatementItems([
      { ...baseTx, id: 'older', transactionAt: '2026-06-01T00:00:00.000Z' },
      { ...baseTx, id: 'newer', transactionAt: '2026-07-10T00:00:00.000Z' },
    ]);

    expect(items.map((t) => t.id)).toEqual(['newer', 'older']);
  });
});
