import { render, screen } from '@testing-library/react';
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
  showSecondaryExpanded: false,
  expandSecondary: vi.fn(),
  collapseSecondary: vi.fn(),
};

describe('DecisionDashboardFeature', () => {
  it('renders parecer reading order: conclusion, evidence, recommendation, benefit', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'O ciclo está em risco.',
        dataState: 'sufficient',
        action: {
          id: 'a1',
          label: 'Prioritize the critical payment',
          rationale: 'Protect the cycle today',
        },
        priorityCards: [
          { code: 'S2', title: 'Saídas críticas', summary: 'There are upcoming outs' },
        ],
        secondaryCards: [],
        insightMessage: 'Focus on the cycle',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByLabelText('Decision status')).toBeInTheDocument();
    expect(screen.getByLabelText('Conclusion evidence')).toBeInTheDocument();
    expect(screen.getByLabelText('Action of the day')).toBeInTheDocument();
    expect(screen.getByLabelText('Recommendation benefit')).toBeInTheDocument();
    expect(screen.queryByText(/Metas/i)).not.toBeInTheDocument();
  });

  it('uses parecer language and puts recommendation after evidence', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Você está no caminho para fechar este mês com tranquilidade.',
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
        insightMessage: 'Isso reduz a pressão do ciclo — FP-1 e engine ordering S2.',
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByText(/Rafael/)).toBeInTheDocument();
    expect(screen.getByText(/Uma decisão clara para o seu caixa hoje/i)).toBeInTheDocument();
    expect(screen.getByText(/^Por quê$/i)).toBeInTheDocument();
    expect(screen.getByText(/Chegamos a essa conclusão porque/i)).toBeInTheDocument();
    expect(screen.getByText(/^Hoje$/)).toBeInTheDocument();
    expect(screen.getByText(/Se eu estivesse no seu lugar/i)).toBeInTheDocument();
    expect(screen.getByText(/^O que muda$/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Today's commitment")).toHaveTextContent(/Quero priorizar isso/i);
    expect(screen.queryByRole('button', { name: /Quero priorizar isso/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Em volta disso/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/O que percebemos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/FP-1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Parecer de hoje/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Olhamos com calma/i)).not.toBeInTheDocument();

    const evidence = screen.getByLabelText('Conclusion evidence');
    const action = screen.getByLabelText('Action of the day');
    expect(
      evidence.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('does not render benefit-only from empty insight on no_data when rationale exists', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Ainda não há dados suficientes.',
        dataState: 'no_data',
        action: {
          id: 'capture-survivor',
          label: 'Registrar o mínimo do ciclo',
          rationale: 'Complete essentials.',
        },
        priorityCards: [],
        secondaryCards: [],
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Reason',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.queryByLabelText('Conclusion evidence')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Registrar o mínimo do ciclo' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Today's commitment")).toHaveTextContent('Começar o registro');
    expect(screen.queryByRole('button', { name: 'Começar o registro' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Recommendation benefit')).toBeInTheDocument();
  });

  it('renders preserve, avoid, and custom CTA for hold-credit decision', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      viewModel: {
        question: 'Vou conseguir fechar este mês?',
        status: 'Hoje na conta tem cerca de R$ 44. No planejamento, o mês pode fechar positivo.',
        dataState: 'sufficient',
        action: {
          id: 'survivor-hold-credit',
          label: 'Não use o Ultraviolet nem o Signature até a OUTSERA de 20/07.',
          rationale: '',
          ctaLabel: 'Vou segurar os dois cartões até o dia 20',
        },
        priorityCards: [
          { code: 'S1', title: 'Caixa', summary: 'Dinheiro na conta hoje: cerca de R$ 44' },
        ],
        secondaryCards: [],
        preserveLines: [
          'O dinheiro que ainda resta na conta até a próxima entrada chegar',
          'Sua folga para pagar o que já está combinado, sem precisar abrir mais dívida',
        ],
        avoidLines: [
          'Usar o cartão como se fosse o salário do mês',
          'Abrir o Signature ou qualquer limite novo antes da OUTSERA chegar',
        ],
        showSecondary: false,
        showNextJourneyStage: false,
        nextJourneyStageLabel: 'Enxergar',
        nextJourneyStageSummary: 'Clarity',
        nextJourneyStageReason: 'Because clarity follows',
        showAiBlock: false,
        showEvolutionBanner: false,
      },
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByText(/Decisão de hoje/i)).toBeInTheDocument();
    expect(screen.getByText(/^O que proteger$/i)).toBeInTheDocument();
    expect(screen.getByText(/^O que evitar$/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Today's commitment")).toHaveTextContent(
      /Vou segurar os dois cartões até o dia 20/i,
    );
    expect(
      screen.queryByRole('button', { name: /Vou segurar os dois cartões até o dia 20/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Recommendation benefit')).not.toBeInTheDocument();
    expect(screen.queryByText(/Gerar Caixa/i)).not.toBeInTheDocument();
  });

  it('shows awaiting company idle state instead of error', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      surfaceState: 'awaiting_company',
      isAwaitingCompany: true,
      viewModel: null,
    });

    render(<DecisionDashboardFeature />);

    expect(screen.getByLabelText('Awaiting company selection')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders centered loading feedback with evolution steps', () => {
    mockedHook.mockReturnValue({
      ...baseReady,
      surfaceState: 'loading',
      isLoading: true,
      loadingMessage: 'Montando seu parecer de hoje…',
      loadingSteps: [
        {
          id: 'accounts_budget',
          label: 'Organizando contas e planejamento do mês…',
          status: 'done',
        },
        {
          id: 'summary',
          label: 'Lendo entradas, saídas e saldo do mês…',
          status: 'done',
        },
        {
          id: 'movements',
          label: 'Revisando movimentações recentes…',
          status: 'done',
        },
        {
          id: 'credit',
          label: 'Verificando pressão de crédito…',
          status: 'done',
        },
        {
          id: 'assembly',
          label: 'Montando seu parecer de hoje…',
          status: 'active',
        },
      ],
      viewModel: null,
    });

    render(<DecisionDashboardFeature />);

    const loadingRegion = screen.getByLabelText('Montando parecer de hoje');
    expect(loadingRegion).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Montando seu parecer de hoje')).toBeInTheDocument();
    expect(screen.getAllByText('Montando seu parecer de hoje…').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText('Loading progress')).toBeInTheDocument();
    expect(screen.getByLabelText('Progresso do parecer')).toBeInTheDocument();
    expect(screen.getByText('4 de 5 etapas concluídas')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading decision status')).not.toBeInTheDocument();
  });
});
