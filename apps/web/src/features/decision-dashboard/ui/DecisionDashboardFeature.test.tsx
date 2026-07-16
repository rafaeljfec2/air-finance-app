import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useDecisionDashboard } from '../hooks/useDecisionDashboard';

import { DecisionDashboardFeature } from './DecisionDashboardFeature';

vi.mock('../hooks/useDecisionDashboard', () => ({
  useDecisionDashboard: vi.fn(),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { user: { name: string } | null }) => unknown) =>
    selector({ user: { name: 'Rafael Silva' } }),
}));

const mockedHook = vi.mocked(useDecisionDashboard);

const baseReady = {
  surfaceState: 'ready' as const,
  isLoading: false,
  isError: false,
  isAwaitingCompany: false,
  loadingMessage: null,
  loadingSteps: [],
  summary: {
    income: 14475.39,
    expenses: 11067.92,
    balance: 3407.47,
    previousIncome: null,
    previousExpenses: null,
    previousBalance: null,
    accumulatedBalance: null,
    incomeChangePct: null,
    expensesChangePct: null,
    balanceChangePct: null,
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
  },
  expensesByCategory: [
    { categoryId: '1', name: 'Moradia', color: '#3B82F6', value: 4450 },
    { categoryId: '2', name: 'Alimentação', color: '#F59E0B', value: 1920 },
  ],
  recentMovements: [
    {
      id: 'tx-1',
      description: 'Cursor AI',
      categoryLabel: 'Software',
      accountLabel: 'Nubank',
      value: -108.19,
      launchType: 'expense' as const,
      paymentDate: '2026-07-16T10:00:00.000Z',
      balanceAfter: 44.22,
    },
  ],
  isRecentMovementsLoading: false,
  showSecondaryExpanded: false,
  expandSecondary: vi.fn(),
  collapseSecondary: vi.fn(),
};

function renderFeature() {
  return render(
    <MemoryRouter>
      <DecisionDashboardFeature />
    </MemoryRouter>,
  );
}

describe('DecisionDashboardFeature', () => {
  it('renders decision desk hierarchy: decision, situation, summary, movements', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'O ciclo está em risco.',
        dataState: 'sufficient',
        action: {
          id: 'a1',
          label: 'Não use o Ultraviolet até a OUTSERA de 20/07.',
          rationale: 'Protect the cycle today',
        },
        priorityCards: [
          { code: 'S1', title: 'Na conta hoje', summary: 'R$ 44,22' },
          { code: 'S2', title: 'No plano do mês', summary: '+R$ 4.816,08' },
          {
            code: 'S3',
            title: 'Próxima entrada',
            summary: 'OUTSERA · R$ 21.751,20 · dia 20',
          },
        ],
        secondaryCards: [],
        insightMessage: 'Seguindo isso, você mantém o plano e evita comprometer seu futuro.',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    renderFeature();

    expect(screen.getByLabelText('Decision desk')).toBeInTheDocument();
    expect(screen.getByLabelText('Sua decisão de hoje')).toBeInTheDocument();
    expect(screen.getByLabelText('Situação atual')).toBeInTheDocument();
    expect(screen.getByLabelText('Resumo do mês')).toBeInTheDocument();
    expect(screen.getByLabelText('Últimos movimentos')).toBeInTheDocument();
    expect(screen.getByText(/Rafael/)).toBeInTheDocument();
    expect(screen.getByText(/Uma decisão clara para o seu caixa hoje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver detalhes da decisão/i })).toBeInTheDocument();
    expect(screen.getByText('Na conta hoje')).toBeInTheDocument();
    expect(screen.getByText('Cursor AI')).toBeInTheDocument();
    expect(screen.queryByText(/^O que proteger$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^O que evitar$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ver um pouco mais/i)).not.toBeInTheDocument();
  });

  it('keeps decision before situation and summary in document order', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Você está no caminho.',
        dataState: 'sufficient',
        action: {
          id: 'a1',
          label: 'Priorize o pagamento crítico',
          rationale: 'Protege o ciclo hoje.',
        },
        priorityCards: [
          { code: 'S2', title: 'Saídas críticas', summary: 'Há vencimentos próximos.' },
        ],
        secondaryCards: [],
        insightMessage: 'Isso reduz a pressão do mês.',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    renderFeature();

    const decision = screen.getByLabelText('Sua decisão de hoje');
    const situation = screen.getByLabelText('Situação atual');
    const summary = screen.getByLabelText('Resumo do mês');

    expect(
      decision.compareDocumentPosition(situation) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      situation.compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('shows awaiting company idle state instead of error', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      surfaceState: 'awaiting_company',
      isAwaitingCompany: true,
      viewModel: null,
      summary: null,
      expensesByCategory: [],
      recentMovements: [],
    });

    renderFeature();

    expect(screen.getByLabelText('Awaiting company selection')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('preserves centered loading feedback with evolution steps', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      surfaceState: 'loading',
      isLoading: true,
      loadingMessage: 'Avaliando pressão financeira',
      loadingSteps: [
        {
          id: 'movements',
          label: 'Organizando movimentações',
          description: 'Reunindo as movimentações deste período.',
          status: 'done',
        },
        {
          id: 'inflows_outflows',
          label: 'Entendendo entradas e saídas',
          description: 'Classificando as transações do mês.',
          status: 'done',
        },
        {
          id: 'commitments',
          label: 'Identificando compromissos',
          description: 'Mapeando seus gastos fixos e parcelas.',
          status: 'done',
        },
        {
          id: 'pressure',
          label: 'Avaliando pressão financeira',
          description: 'Verificando se o crédito está ajudando ou escondendo pressão no fluxo.',
          status: 'active',
        },
        {
          id: 'history_patterns',
          label: 'Cruzando padrões do histórico',
          description: 'Comparando com os últimos 6 meses.',
          status: 'pending',
        },
        {
          id: 'report',
          label: 'Escrevendo seu parecer',
          description: 'Montando insights e recomendações.',
          status: 'pending',
        },
      ],
      viewModel: null,
      summary: null,
      expensesByCategory: [],
      recentMovements: [],
    });

    renderFeature();

    const loadingRegion = screen.getByLabelText('Analisando seu sistema financeiro');
    expect(loadingRegion).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Analisando seu sistema financeiro')).toBeInTheDocument();
    expect(screen.getByText('Avaliando pressão financeira')).toBeInTheDocument();
    expect(screen.getByText('Comparando com os últimos 6 meses.')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading progress')).toBeInTheDocument();
    expect(screen.getByText('Seus dados estão seguros e criptografados.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Decision desk')).not.toBeInTheDocument();
  });
});
