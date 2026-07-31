import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmptyOpenFinanceCards } from './EmptyOpenFinanceCards';

const mockNavigate = vi.fn();
const mockGetEntitlement = vi.fn();
const mockToastError = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/stores/company', () => ({
  useCompanyStore: () => ({
    activeCompany: { id: 'company-1' },
  }),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { user: { role: string } | null }) => unknown) =>
    selector({ user: { role: 'user' } }),
}));

vi.mock('@/services/subscriptionService', () => ({
  openBankingService: {
    getEntitlement: (...args: unknown[]) => mockGetEntitlement(...args),
  },
  subscriptionService: {
    getPlans: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('@/components/ui/toast', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('@/components/accounts/OpenBankingPaywallModal', () => ({
  OpenBankingPaywallModal: ({ open }: { readonly open: boolean }) =>
    open ? <div data-testid="open-banking-paywall">Paywall</div> : null,
}));

describe('EmptyOpenFinanceCards', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockGetEntitlement.mockReset();
    mockToastError.mockReset();
  });

  it('navigates to Open Finance when the company has entitled slots', async () => {
    mockGetEntitlement.mockResolvedValue({
      entitledSlots: 2,
      usedSlots: 0,
      canConnect: true,
      isGodBypass: false,
    });

    render(
      <MemoryRouter>
        <EmptyOpenFinanceCards />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Conectar Open Finance/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/openfinance');
    });
    expect(screen.queryByTestId('open-banking-paywall')).not.toBeInTheDocument();
  });

  it('opens paywall when there are no Open Banking licenses', async () => {
    mockGetEntitlement.mockResolvedValue({
      entitledSlots: 0,
      usedSlots: 0,
      canConnect: false,
      isGodBypass: false,
    });

    render(
      <MemoryRouter>
        <EmptyOpenFinanceCards />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Conectar Open Finance/i }));

    await waitFor(() => {
      expect(screen.getByTestId('open-banking-paywall')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders empty state content', () => {
    render(
      <MemoryRouter>
        <EmptyOpenFinanceCards />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('empty-open-finance-cards')).toBeInTheDocument();
    expect(screen.getByText('Conecte seus cartões de crédito')).toBeInTheDocument();
    expect(screen.getByText('Faturas em aberto')).toBeInTheDocument();
  });
});
