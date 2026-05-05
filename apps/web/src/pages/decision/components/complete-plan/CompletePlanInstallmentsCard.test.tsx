import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CompletePlanInstallmentsCard } from './CompletePlanInstallmentsCard';

const baseItem = {
  monthlyValue: 100,
  remaining: 2,
  endDate: '2026-12-01',
  accountId: 'acc',
  accountType: 'credit_card' as const,
  categoryId: null,
};

describe('CompletePlanInstallmentsCard', () => {
  it('shows at most three high or medium rows in the main list and the remainder inside details', () => {
    const { container } = render(
      <CompletePlanInstallmentsCard
        strategy={{
          suggestion: 'Sugestão.',
          items: [
            { ...baseItem, accountId: 'a', description: 'Alta um', priority: 'high' },
            { ...baseItem, accountId: 'b', description: 'Média um', priority: 'medium' },
            { ...baseItem, accountId: 'c', description: 'Alta dois', priority: 'high' },
            { ...baseItem, accountId: 'd', description: 'Média extra', priority: 'medium' },
            { ...baseItem, accountId: 'e', description: 'Baixa um', priority: 'low' },
          ],
        }}
      />,
    );

    const mainList = container.querySelector('section > ul');
    expect(mainList?.querySelectorAll('li')).toHaveLength(3);
    const detailsList = container.querySelector('details ul');
    expect(detailsList?.querySelectorAll('li')).toHaveLength(2);

    expect(screen.getByText('Alta um')).toBeInTheDocument();
    expect(screen.getByText('Ver mais 2 parcelas')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ver mais 2 parcelas'));

    expect(screen.getByText('Média extra')).toBeInTheDocument();
    expect(screen.getByText('Baixa um')).toBeInTheDocument();
  });

  it('uses singular label when one parcel remains in the collapsible', () => {
    render(
      <CompletePlanInstallmentsCard
        strategy={{
          suggestion: 'Sug.',
          items: [
            { ...baseItem, accountId: 'a', description: 'Só alta', priority: 'high' },
            { ...baseItem, accountId: 'b', description: 'Só baixa', priority: 'low' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Ver mais 1 parcela')).toBeInTheDocument();
  });
});
