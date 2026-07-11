import { render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestMemoryRouter } from '@/test/TestMemoryRouter';

import { CreditCardBillsGodGate } from './CreditCardBillsGodGate';

const mockUseAuthStore = vi.fn();
const mockGetCurrentUser = vi.fn();

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

vi.mock('@/services/authService', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}));

vi.mock('./index', () => ({
  CreditCardBillsPage: () => <div>Legacy bills page</div>,
}));

vi.mock('@/components/ui/spinner', () => ({
  Spinner: () => <div>Loading</div>,
}));

function renderGate() {
  return render(
    <TestMemoryRouter initialEntries={['/credit-cards/bills']}>
      <Routes>
        <Route path="/credit-cards/bills" element={<CreditCardBillsGodGate />} />
        <Route path="/credit-cards-v2" element={<div>V2 page</div>} />
      </Routes>
    </TestMemoryRouter>,
  );
}

describe('CreditCardBillsGodGate', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReset();
    mockGetCurrentUser.mockReset();
  });

  it('renders the legacy bills page for god users', async () => {
    mockUseAuthStore.mockReturnValue({
      user: { role: 'god' },
      isAuthenticated: true,
    });

    renderGate();

    expect(await screen.findByText('Legacy bills page')).toBeInTheDocument();
  });

  it('redirects non-god users to credit-cards-v2', async () => {
    mockUseAuthStore.mockReturnValue({
      user: { role: 'user' },
      isAuthenticated: true,
    });
    mockGetCurrentUser.mockResolvedValue({ role: 'user' });

    renderGate();

    await waitFor(() => {
      expect(screen.getByText('V2 page')).toBeInTheDocument();
    });
  });
});
