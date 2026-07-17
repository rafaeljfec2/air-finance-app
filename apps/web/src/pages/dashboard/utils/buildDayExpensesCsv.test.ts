import { describe, expect, it } from 'vitest';

import { buildDayExpensesCsv } from './buildDayExpensesCsv';
import type { DayExpensesSummary } from './buildDayExpensesSummary';

const summary: DayExpensesSummary = {
  total: 150,
  count: 2,
  average: 75,
  accountsUsed: 2,
  groups: [
    {
      accountId: 'acc-1',
      accountName: 'Banco do Brasil',
      accountColor: '#0033AA',
      accountIcon: 'Landmark',
      kind: 'account',
      kindLabel: 'Conta',
      paymentMethodLabel: 'Débito',
      maskedNumber: '•••• 1234',
      subtotal: 100,
      rows: [
        {
          id: 'a',
          description: 'Mercado',
          amount: 100,
          categoryName: 'Compras',
          categoryColor: '#8A05BE',
        },
      ],
    },
    {
      accountId: 'acc-2',
      accountName: 'Nubank',
      accountColor: '#8A05BE',
      accountIcon: 'CreditCard',
      kind: 'card',
      kindLabel: 'Cartão',
      paymentMethodLabel: 'Crédito',
      subtotal: 50,
      rows: [
        {
          id: 'b',
          description: 'iFood; almoço',
          amount: 50,
          categoryName: 'Alimentação',
          categoryColor: '#FF0000',
        },
      ],
    },
  ],
};

describe('buildDayExpensesCsv', () => {
  it('builds a semicolon-separated csv with header and one row per expense', () => {
    const csv = buildDayExpensesCsv(summary);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('Conta/Cartão;Descrição;Categoria;Forma de pagamento;Valor');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('Banco do Brasil;Mercado;Compras;Débito;-100,00');
  });

  it('escapes fields containing the separator with quotes', () => {
    const csv = buildDayExpensesCsv(summary);

    expect(csv).toContain('Nubank;"iFood; almoço";Alimentação;Crédito;-50,00');
  });

  it('returns only the header for an empty summary', () => {
    const csv = buildDayExpensesCsv({
      total: 0,
      count: 0,
      average: 0,
      accountsUsed: 0,
      groups: [],
    });

    expect(csv).toBe('Conta/Cartão;Descrição;Categoria;Forma de pagamento;Valor');
  });
});
