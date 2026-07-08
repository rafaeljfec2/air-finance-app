import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from './apiClient';
import { getCreditCardStatement } from './creditCardService';

vi.mock('./apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('creditCardService BOLA paths', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('uses company-scoped billing path for statement', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { totalSpent: 0, availableLimit: 1000, transactions: [] },
    });

    await getCreditCardStatement('company-1', 'card-1', 3, 2026);

    expect(apiClient.get).toHaveBeenCalledWith(
      '/companies/company-1/credit-cards/card-1/bills/2026-03',
    );
  });
});
