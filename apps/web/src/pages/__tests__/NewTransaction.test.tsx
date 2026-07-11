import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestMemoryRouter } from '@/test/TestMemoryRouter';

import { NewTransaction } from '../transactions/new';

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({
    activeCompany: { id: 'company-1', name: 'Test Co' },
  }),
}));

vi.mock('../transactions/new/hooks/useTransactionData', () => ({
  useTransactionData: () => ({
    accounts: [{ id: 'acc1', name: 'Main Account', type: 'checking' }],
    categories: [
      {
        id: 'cat1',
        name: 'Food',
        type: 'EXPENSE',
        color: '#F44336',
        icon: '🍽️',
      },
      {
        id: 'cat2',
        name: 'Salary',
        type: 'INCOME',
        color: '#4CAF50',
        icon: '💰',
      },
    ],
    loading: false,
    loadError: null,
  }),
}));

vi.mock('@/layouts/ViewDefault', () => ({
  ViewDefault: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TestMemoryRouter>
        <NewTransaction />
      </TestMemoryRouter>
    </QueryClientProvider>,
  );
}

describe('NewTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the new transaction form', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Salvar Despesa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  it('switches submit label when choosing income type', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Receita/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Salvar Receita/i })).toBeInTheDocument();
    });
  });
});
