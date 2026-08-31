import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { CreditCard, CreditCardBill } from '@/types/budget';

import { CreditCardsSection } from './CreditCardsSection';

const activeBill: CreditCardBill = {
  id: 'bill-1',
  cardId: 'card-1',
  month: '2026-08',
  total: 8062.29,
  dueDate: '2026-09-06',
  status: 'OPEN',
  transactions: [
    {
      id: 'installment-open',
      description: 'Amazon - Parcela 2/3',
      value: 200,
      date: '2026-08-15',
      category: 'Parcelado',
    },
    {
      id: 'installment-finishing',
      description: 'Araujo - Parcela 3/3',
      value: 82.68,
      date: '2026-09-01',
      category: 'Saúde',
    },
    {
      id: 'cash-purchase',
      description: 'Supermercado',
      value: 50,
      date: '2026-08-20',
      category: 'Supermercado',
    },
  ],
};

const cards: CreditCard[] = [
  {
    id: 'card-1',
    accountId: 'account-1',
    name: 'ultraviolet-black MASTERCARD',
    brand: 'nubank',
    limit: 58200,
    bills: [activeBill],
  },
  {
    id: 'card-2',
    accountId: 'account-2',
    name: 'Itau Uniclass Visa Signature',
    brand: 'itau',
    limit: 10000,
    bills: [],
  },
];

function renderSection(overrides?: Partial<Parameters<typeof CreditCardsSection>[0]>) {
  const onActiveCardChange = vi.fn();

  render(
    <CreditCardsSection
      cards={cards}
      activeBill={activeBill}
      activeCardLimit={58200}
      activeCardBillTotal={8062.29}
      activeCardTab="card-1"
      isLoading={false}
      onActiveCardChange={onActiveCardChange}
      {...overrides}
    />,
  );

  return { onActiveCardChange };
}

function getFilterButton(label: RegExp) {
  return screen.getByRole('button', { name: label });
}

describe('CreditCardsSection', () => {
  it('shows grouped sections by default', () => {
    renderSection();

    expect(screen.getByRole('heading', { name: /Parcelas Finalizando/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Outras Compras/i })).toBeInTheDocument();
    expect(screen.getByText('Amazon - Parcela 2/3')).toBeInTheDocument();
    expect(screen.getAllByText('Supermercado').length).toBeGreaterThanOrEqual(1);
  });

  it('filters the grid when clicking Parcelado and toggles off on second click', () => {
    renderSection();

    fireEvent.click(getFilterButton(/^Parcelado/i));

    expect(screen.getByRole('heading', { name: /Parcelado \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText('Amazon - Parcela 2/3')).toBeInTheDocument();
    expect(screen.getByText('Araujo - Parcela 3/3')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Outras Compras/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Supermercado')).not.toBeInTheDocument();

    fireEvent.click(getFilterButton(/^Parcelado/i));

    expect(screen.getByRole('heading', { name: /Parcelas Finalizando/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Outras Compras/i })).toBeInTheDocument();
  });

  it('resets the active filter when switching cards', () => {
    function Harness() {
      const [activeCardTab, setActiveCardTab] = useState('card-1');
      const selectedCard = cards.find((card) => card.id === activeCardTab);
      const selectedBill = selectedCard?.bills[0];

      return (
        <CreditCardsSection
          cards={cards}
          activeBill={selectedBill}
          activeCardLimit={selectedCard?.limit ?? 0}
          activeCardBillTotal={selectedBill?.total ?? 0}
          activeCardTab={activeCardTab}
          isLoading={false}
          onActiveCardChange={setActiveCardTab}
        />
      );
    }

    render(<Harness />);

    fireEvent.click(getFilterButton(/^Crédito à vista/i));
    expect(screen.getByRole('heading', { name: /Crédito à vista \(1\)/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Itau Uniclass Visa Signature/i }));

    expect(screen.getByText('Nenhuma transação de cartão neste período.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Crédito à vista/i })).not.toBeInTheDocument();
  });
});
