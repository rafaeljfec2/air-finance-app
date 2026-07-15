import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCompletePlan, type CompletePlanResponse } from '@/services/completePlanService';
import { TestMemoryRouter } from '@/test/TestMemoryRouter';

import { DecisionCompletePlanSection } from './DecisionCompletePlanSection';

vi.mock('@/services/completePlanService', () => ({
  fetchCompletePlan: vi.fn(),
}));

const samplePayload: CompletePlanResponse = {
  status: 'attention',
  primary_issue: 'high_commitment',
  theme_phase: 'yellow',
  diagnosis: 'Você está comprometendo bastante.',
  coherenceNote: 'O foco em parcelas combina com o compromisso acima da meta.',
  numbers: {
    netIncome: 5000,
    totalCommitted: 1500,
    committedPct: 0.3,
    healthyTargetPct: 0.25,
    reductionNeeded: 250,
  },
  projection: {
    in30Days: { totalCommitted: 1500, committedPct: 0.3, installmentsEnding: 0 },
    in60Days: { totalCommitted: 1300, committedPct: 0.26, installmentsEnding: 1 },
    in90Days: { totalCommitted: 1100, committedPct: 0.22, installmentsEnding: 2 },
    ifNoChange: 'Em 90 dias, o compromisso cai R$ 400.',
  },
  installmentsStrategy: {
    items: [
      {
        description: 'Compra X',
        monthlyValue: 800,
        remaining: 4,
        endDate: '2026-09-05',
        accountId: 'acc-1',
        accountType: 'credit_card',
        categoryId: null,
        priority: 'high',
      },
    ],
    suggestion: 'Comece pela parcela maior.',
  },
  behavior: {
    topCategories: [{ name: 'Alimentação', amount: 800, share: 0.4 }],
    peakDaysOfMonth: [5, 10],
    creditUtilizationTrend: null,
  },
  variableSpending: {
    bucketHealth: 'attention',
    totalVariable: 900,
    previousTotalVariable: 700,
    percentOfIncome: 0.18,
    monthOverMonthChangePct: 28.57,
    topCategories: [{ name: 'Lazer', amount: 400, share: 0.44 }],
    peakDaysOfMonth: [6],
  },
  personalRules: [
    { id: 'anchor:high_commitment', text: 'Limite as parcelas a 25%.', rationale: 'Anchor.' },
  ],
  simpleRule: 'Nunca comprometer mais de 25% da renda com parcelas.',
  expectedOutcome: 'Você libera espaço no orçamento.',
  llmCached: false,
  referencePeriod: '2026-05',
  generatedAt: '2026-05-01T12:00:00.000Z',
  ruleEngineVersion: '1.0.1',
};

function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <TestMemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </TestMemoryRouter>,
  );
}

describe('DecisionCompletePlanSection', () => {
  beforeEach(() => {
    vi.mocked(fetchCompletePlan).mockReset();
  });

  it('shows loading state while fetching', () => {
    vi.mocked(fetchCompletePlan).mockReturnValue(new Promise(() => undefined));

    renderWithClient(<DecisionCompletePlanSection companyId="c1" />);

    expect(screen.getByText('Carregando seu plano…')).toBeInTheDocument();
  });

  it('renders diagnosis, coherence note and numbers; keeps detailed plan inside a closed disclosure', async () => {
    vi.mocked(fetchCompletePlan).mockResolvedValue(samplePayload);

    renderWithClient(<DecisionCompletePlanSection companyId="c1" />);

    await waitFor(() =>
      expect(screen.getByText('Você está comprometendo bastante.')).toBeInTheDocument(),
    );
    expect(screen.getByText('Leitura dos números')).toBeInTheDocument();
    expect(
      screen.getByText('O foco em parcelas combina com o compromisso acima da meta.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Sua situação em números')).toBeInTheDocument();
    expect(screen.getByText('Resumo do gasto variável')).toBeInTheDocument();
    expect(screen.getAllByText('Pediu atenção').length).toBeGreaterThanOrEqual(1);

    const details = screen.getByText('Ver detalhes do plano').closest('details');
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute('open');

    fireEvent.click(screen.getByText('Ver detalhes do plano'));

    expect(details).toHaveAttribute('open');
    expect(screen.getByText('Suas parcelas e por onde começar')).toBeInTheDocument();
    expect(screen.getByText('Compra X')).toBeInTheDocument();
    expect(screen.getByText(/Alimenta/)).toBeInTheDocument();
    expect(screen.getByText('Gastos variáveis')).toBeInTheDocument();
    expect(screen.getByText('Onde cortar primeiro')).toBeInTheDocument();
    expect(screen.getByText('Limite as parcelas a 25%.')).toBeInTheDocument();
    expect(
      screen.getByText('Nunca comprometer mais de 25% da renda com parcelas.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Você libera espaço no orçamento.')).toBeInTheDocument();
    expect(screen.getByText(/Período: 2026-05/)).toBeInTheDocument();
  });

  it('shows an error card with retry when the request fails', async () => {
    vi.mocked(fetchCompletePlan).mockRejectedValue(new Error('boom'));

    renderWithClient(<DecisionCompletePlanSection companyId="c1" />);

    await waitFor(() =>
      expect(screen.getByText('Não foi possível carregar seu plano')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
  });

  it('renders empty installments fallback when there are no items', async () => {
    vi.mocked(fetchCompletePlan).mockResolvedValue({
      ...samplePayload,
      installmentsStrategy: { items: [], suggestion: 'sug' },
    });

    renderWithClient(<DecisionCompletePlanSection companyId="c1" />);

    await waitFor(() =>
      expect(screen.getByText('Você está comprometendo bastante.')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText('Ver detalhes do plano'));
    await waitFor(() =>
      expect(screen.getByText('Você não tem parcelas ativas no momento.')).toBeInTheDocument(),
    );
  });

  it('does not query when companyId is empty', () => {
    vi.mocked(fetchCompletePlan).mockResolvedValue(samplePayload);

    renderWithClient(<DecisionCompletePlanSection companyId="" />);

    expect(fetchCompletePlan).not.toHaveBeenCalled();
  });

  it('shows a single sparse block for data_incomplete instead of zero mosaics', async () => {
    vi.mocked(fetchCompletePlan).mockResolvedValue({
      ...samplePayload,
      primary_issue: 'data_incomplete',
      diagnosis: 'Cadastre renda e movimentos para ler o período.',
      numbers: {
        netIncome: 0,
        totalCommitted: 0,
        committedPct: 0,
        healthyTargetPct: 0.25,
        reductionNeeded: 0,
      },
      variableSpending: {
        ...samplePayload.variableSpending,
        totalVariable: 0,
        previousTotalVariable: 0,
        percentOfIncome: null,
      },
    });

    renderWithClient(<DecisionCompletePlanSection companyId="c1" />);

    await waitFor(() =>
      expect(screen.getByText('Leitura do período indisponível')).toBeInTheDocument(),
    );
    expect(screen.getByText('Cadastre renda e movimentos para ler o período.')).toBeInTheDocument();
    expect(screen.queryByText('Sua situação em números')).not.toBeInTheDocument();
    expect(screen.queryByText('Resumo do gasto variável')).not.toBeInTheDocument();
    expect(screen.queryByText('Equilibrado')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir para a Home' })).toHaveAttribute('href', '/home');
  });
});
