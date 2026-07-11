import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as openiService from '@/services/openiService';

import type { OpenFinanceCreditCard } from '../mappers/mapAccountToOpenFinanceCreditCard';

import { useOpenFinanceCardDetails } from './useOpenFinanceCardDetails';

vi.mock('@/services/openiService', () => ({
  getCreditCard: vi.fn(),
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

describe('useOpenFinanceCardDetails', () => {
  beforeEach(() => {
    vi.mocked(openiService.getCreditCard).mockReset();
  });

  it('does not fetch when card is null', () => {
    const { result } = renderHook(
      () => useOpenFinanceCardDetails({ companyId: 'company-1', card: null }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(false);
    expect(openiService.getCreditCard).not.toHaveBeenCalled();
  });

  it('loads and sorts bills from open finance card details', async () => {
    vi.mocked(openiService.getCreditCard).mockResolvedValue({
      id: 'openi-card-1',
      name: 'Card',
      digits: '1234',
      brand: 'MASTERCARD',
      level: 'BLACK',
      status: 'ACTIVE',
      currency: 'BRL',
      holderType: null,
      limitTotal: 1000,
      limitUsed: 100,
      limitAvailable: 900,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      limits: [],
      bills: [
        {
          id: 'bill-old',
          amount: 100,
          currency: 'BRL',
          minimumPayment: 10,
          allowsInstallments: false,
          dueDate: '2026-06-01T00:00:00.000Z',
          createdAt: '2026-05-01T00:00:00.000Z',
          updatedAt: '2026-05-01T00:00:00.000Z',
        },
        {
          id: 'bill-new',
          amount: 200,
          currency: 'BRL',
          minimumPayment: 20,
          allowsInstallments: true,
          dueDate: '2026-08-01T00:00:00.000Z',
          createdAt: '2026-07-01T00:00:00.000Z',
          updatedAt: '2026-07-01T00:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(
      () => useOpenFinanceCardDetails({ companyId: 'company-1', card }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.bills).toHaveLength(2));
    expect(result.current.bills[0]?.id).toBe('bill-new');
    expect(result.current.bills[0]?.amount).toBe(200);
  });
});
