import { describe, expect, it } from 'vitest';

import type { OpenBillTransactionInput } from './projectInstallmentsForOpenBill';
import { projectInstallmentsForOpenBill } from './projectInstallmentsForOpenBill';

const CYCLE = { startDate: '2026-06-28', endDate: '2026-07-17' } as const;
const CLOSING_DAY = 28;

function tx(
  overrides: Partial<OpenBillTransactionInput> &
    Pick<OpenBillTransactionInput, 'id' | 'description' | 'amount' | 'transactionAt'>,
): OpenBillTransactionInput {
  return {
    status: 'PENDING',
    type: 'DEBIT',
    installmentNumber: null,
    installmentTotal: null,
    ...overrides,
  };
}

describe('projectInstallmentsForOpenBill', () => {
  it('ignores bill payment credits when computing the cycle amount', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: '1',
          description: 'Supermercado',
          amount: 300,
          transactionAt: '2026-07-10T12:00:00.000Z',
        }),
        tx({
          id: '2',
          description: 'Pagamento recebido',
          amount: -14228.96,
          type: 'CREDIT',
          transactionAt: '2026-07-01T12:00:00.000Z',
        }),
        tx({
          id: '3',
          description: 'Estorno de compra',
          amount: -50,
          type: 'CREDIT',
          transactionAt: '2026-07-07T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.cycleAmount).toBe(250);
    expect(result.totalEstimated).toBe(250);
  });

  it('returns only cycle net amount when there are no installment series', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: '1',
          description: 'Supermercado',
          amount: 100,
          transactionAt: '2026-07-10T12:00:00.000Z',
        }),
        tx({
          id: '2',
          description: 'Estorno',
          amount: -20,
          type: 'CREDIT',
          transactionAt: '2026-07-11T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.cycleAmount).toBe(80);
    expect(result.projectedAmount).toBe(0);
    expect(result.totalEstimated).toBe(80);
    expect(result.isEstimated).toBe(false);
    expect(result.projectedInstallments).toEqual([]);
  });

  it('projects the next installment when the latest parcel is before the open cycle', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'm6',
          description: 'Mapfre Seguros 6/12',
          amount: 514.7,
          installmentNumber: 6,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-05-30T12:00:00.000Z',
        }),
        tx({
          id: 'cycle',
          description: 'Padaria',
          amount: 50,
          transactionAt: '2026-07-05T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.cycleAmount).toBe(50);
    expect(result.projectedAmount).toBe(514.7);
    expect(result.totalEstimated).toBe(564.7);
    expect(result.isEstimated).toBe(true);
    expect(result.projectedInstallments).toEqual([
      {
        id: 'projected:m6:7/12',
        description: 'Mapfre Seguros',
        amount: 514.7,
        installmentLabel: '7/12',
        purchaseDate: '2026-05-30',
      },
    ]);
  });

  it('does not double-count a parcel already PENDING in the open cycle', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'm6',
          description: 'Mapfre Seguros 6/12',
          amount: 514.7,
          installmentNumber: 6,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-05-30T12:00:00.000Z',
        }),
        tx({
          id: 'm7',
          description: 'Mapfre Seguros 7/12',
          amount: 514.7,
          installmentNumber: 7,
          installmentTotal: 12,
          status: 'PENDING',
          transactionAt: '2026-06-30T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.cycleAmount).toBe(514.7);
    expect(result.projectedInstallments).toEqual([]);
    expect(result.isEstimated).toBe(false);
    expect(result.totalEstimated).toBe(514.7);
  });

  it('parses X/Y from description when structured fields are null', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'a1',
          description: 'Amazon Br *Amazon 1/2',
          amount: 129.99,
          status: 'POSTED',
          transactionAt: '2026-06-20T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.projectedInstallments).toHaveLength(1);
    expect(result.projectedInstallments[0]).toMatchObject({
      installmentLabel: '2/2',
      amount: 129.99,
      description: 'Amazon Br *Amazon',
    });
  });

  it('skips finished installment series', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'done',
          description: 'Curso 12/12',
          amount: 99,
          installmentNumber: 12,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-05-10T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.projectedInstallments).toEqual([]);
    expect(result.isEstimated).toBe(false);
  });

  it('projects a single parcel per purchase even when parcels differ by cents', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'c6',
          description: 'Col Chromos Venda Nova 6/9',
          amount: 1515.81,
          installmentNumber: 6,
          installmentTotal: 9,
          status: 'POSTED',
          transactionAt: '2026-05-05T12:00:00.000Z',
        }),
        tx({
          id: 'c7',
          description: 'Col Chromos Venda Nova 7/9',
          amount: 1515.73,
          installmentNumber: 7,
          installmentTotal: 9,
          status: 'POSTED',
          transactionAt: '2026-06-05T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.projectedInstallments).toHaveLength(1);
    expect(result.projectedInstallments[0]).toMatchObject({
      installmentLabel: '8/9',
      amount: 1515.73,
      description: 'Col Chromos Venda Nova',
    });
  });

  it('does not project a parcel already PENDING in the cycle with cent variation', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'm6',
          description: 'Mapfre Seguros 6/12',
          amount: 514.77,
          installmentNumber: 6,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-05-30T12:00:00.000Z',
        }),
        tx({
          id: 'm7',
          description: 'Mapfre Seguros 7/12',
          amount: 514.7,
          installmentNumber: 7,
          installmentTotal: 12,
          status: 'PENDING',
          transactionAt: '2026-06-30T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.cycleAmount).toBe(514.7);
    expect(result.projectedInstallments).toEqual([]);
    expect(result.isEstimated).toBe(false);
  });

  it('keeps distinct purchases from the same merchant and cycle separated', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'p1',
          description: 'Magalu 2/5',
          amount: 400,
          installmentNumber: 2,
          installmentTotal: 5,
          status: 'POSTED',
          transactionAt: '2026-06-05T12:00:00.000Z',
        }),
        tx({
          id: 'p2',
          description: 'Magalu 2/5',
          amount: 150,
          installmentNumber: 2,
          installmentTotal: 5,
          status: 'POSTED',
          transactionAt: '2026-06-06T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.projectedInstallments).toHaveLength(2);
    expect(result.projectedAmount).toBe(550);
  });

  it('uses the latest known installment of a series', () => {
    const result = projectInstallmentsForOpenBill(
      [
        tx({
          id: 'm5',
          description: 'Mapfre Seguros 5/12',
          amount: 514.7,
          installmentNumber: 5,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-04-29T12:00:00.000Z',
        }),
        tx({
          id: 'm6',
          description: 'Mapfre Seguros 6/12',
          amount: 514.7,
          installmentNumber: 6,
          installmentTotal: 12,
          status: 'POSTED',
          transactionAt: '2026-05-30T12:00:00.000Z',
        }),
      ],
      CYCLE,
      CLOSING_DAY,
    );

    expect(result.projectedInstallments).toHaveLength(1);
    expect(result.projectedInstallments[0]?.installmentLabel).toBe('7/12');
  });
});
