import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as openiService from '@/services/openiService';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

import { useOpenFinanceCardStatement } from './useOpenFinanceCardStatement';

vi.mock('@/services/openiService', () => ({
  getCreditCardTransactions: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { readonly children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const card: OpenFinanceCreditCard = {
  id: 'mongo-1',
  openiCardId: 'openi-card-1',
  itemId: 'item-1',
  name: 'OF Card',
  digits: '1234',
  color: '#8A05BE',
};

describe('useOpenFinanceCardStatement', () => {
  beforeEach(() => {
    vi.mocked(openiService.getCreditCardTransactions).mockReset();
  });

  it('does not fetch when card is null', () => {
    const { result } = renderHook(
      () =>
        useOpenFinanceCardStatement({
          companyId: 'company-1',
          card: null,
          period: { startDate: '2026-06-01', endDate: '2026-07-01' },
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(false);
    expect(openiService.getCreditCardTransactions).not.toHaveBeenCalled();
  });

  it('fetches and maps transactions for the selected period', async () => {
    vi.mocked(openiService.getCreditCardTransactions).mockResolvedValue({
      transactions: [
        {
          id: 'tx-1',
          accountId: 'openi-card-1',
          billId: null,
          description: 'Store',
          descriptionRaw: 'Store',
          status: 'PENDING',
          type: 'DEBIT',
          operationType: null,
          amount: 50,
          amountInAccountCurrency: null,
          currency: 'BRL',
          cardNumber: null,
          installmentNumber: 1,
          installmentTotal: 2,
          transactionAt: '2026-06-15T10:00:00.000Z',
          updatedAt: '2026-06-15T10:00:00.000Z',
          createdAt: '2026-06-15T10:00:00.000Z',
        },
      ],
      total: 1,
      periodStart: '2026-06-01',
      periodEnd: '2026-07-01',
      currentBill: { amount: 50, currency: 'BRL' },
      summary: {
        totalAmount: 50,
        totalDebit: 50,
        totalCredit: 0,
        currency: 'BRL',
      },
    });

    const { result } = renderHook(
      () =>
        useOpenFinanceCardStatement({
          companyId: 'company-1',
          card,
          period: { startDate: '2026-06-01', endDate: '2026-07-01' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.transactions).toHaveLength(1));

    expect(openiService.getCreditCardTransactions).toHaveBeenCalledWith(
      'company-1',
      'item-1',
      'openi-card-1',
      'mongo-1',
      {
        startDate: '2026-06-01T00:00:00.000Z',
        endDate: '2026-07-01T23:59:59.999Z',
      },
    );
    expect(result.current.transactions[0]?.installment).toBe('1/2');
    expect(result.current.transactions[0]?.status).toBe('PENDING');
  });
});
