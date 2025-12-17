import React, { useMemo, useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { MonthNavigator } from '@/components/budget/MonthNavigator';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Maximize2 } from 'lucide-react';
import {
  CardContainer,
  CardHeader,
  CardStat,
  BadgeStatus,
  CardEmpty,
  CardTotal,
} from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/utils/date';
import { useCompanyStore } from '@/stores/company';
import { useBudget } from '@/hooks/useBudget';

type ExpandedCard = 'cashFlow' | 'receivables' | 'payables' | 'creditCards' | null;

function NubankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 23V9.5C6.5 7.01472 8.51472 5 11 5C13.4853 5 15.5 7.01472 15.5 9.5V22.5C15.5 24.9853 17.5147 27 20 27C22.4853 27 24.5 24.9853 24.5 22.5V9"
        stroke="#8A05BE"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ItauIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#FF6900" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#002663"
        fontFamily="Arial"
      >
        Itau
      </text>
    </svg>
  );
}

function getExpandedCardTitle(expandedCard: ExpandedCard): string | undefined {
  if (expandedCard === 'cashFlow') return 'Fluxo de Caixa';
  if (expandedCard === 'receivables') return 'Contas a Receber';
  if (expandedCard === 'payables') return 'Contas a Pagar';
  if (expandedCard === 'creditCards') return 'Cartões de Crédito';
  return undefined;
}

export function BudgetPage() {
  // Estado único para filtro central
  const [filter, setFilter] = useState({ month: '12', year: '2025' });

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? null;

  const { data, isLoading } = useBudget(companyId, filter);

  const cashFlow = data?.cashFlow ?? null;
  const receivables = data?.receivables ?? [];
  const payables = data?.payables ?? [];
  const cards = useMemo(() => data?.creditCards ?? [], [data?.creditCards]);

  const [activeCardTab, setActiveCardTab] = useState(cards[0]?.id || '');

  // Estados de página para cada grid
  const [receivablesPage, setReceivablesPage] = useState(1);
  const [payablesPage, setPayablesPage] = useState(1);
  const [cardPage, setCardPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const activeCard = useMemo(
    () => cards.find((c) => c.id === activeCardTab),
    [cards, activeCardTab],
  );
  const activeBill = useMemo(
    () => activeCard?.bills.find((b) => b.month === `${filter.year}-${filter.month}`),
    [activeCard, filter.year, filter.month],
  );

  const activeCardLimit = activeCard?.limit ?? 0;
  const activeCardBillTotal = activeBill?.total ?? 0;
  const activeCardAvailable = activeCardLimit > 0 ? activeCardLimit - activeCardBillTotal : null;

  // Paginação dos dados
  const paginatedReceivables = receivables.slice(
    (receivablesPage - 1) * ITEMS_PER_PAGE,
    receivablesPage * ITEMS_PER_PAGE,
  );
  const paginatedPayables = payables.slice(
    (payablesPage - 1) * ITEMS_PER_PAGE,
    payablesPage * ITEMS_PER_PAGE,
  );
  const paginatedCardTransactions =
    activeBill?.transactions.slice((cardPage - 1) * ITEMS_PER_PAGE, cardPage * ITEMS_PER_PAGE) ||
    [];
  const receivablesTotalPages = Math.ceil(receivables.length / ITEMS_PER_PAGE) || 1;
  const payablesTotalPages = Math.ceil(payables.length / ITEMS_PER_PAGE) || 1;
  const cardTotalPages = Math.ceil((activeBill?.transactions.length || 0) / ITEMS_PER_PAGE) || 1;

  // Resetar página ao trocar de mês/ano ou cartão
  React.useEffect(() => {
    setReceivablesPage(1);
    setPayablesPage(1);
    setCardPage(1);
  }, [filter, activeCardTab]);

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 pt-0 pb-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 p-2">
              <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark">
              Dashboard Financeiro
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
            Visão geral do seu orçamento, fluxo de caixa e contas a pagar/receber
          </p>
        </div>
        {/* Filtro centralizado */}
        <div className="flex justify-center mb-8">
          <MonthNavigator
            month={filter.month}
            year={filter.year}
            onChange={(month, year) => setFilter({ month, year })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {/* Fluxo de Caixa */}
          <CardContainer color="emerald" className="min-h-[420px]">
            <CardHeader icon={<Wallet size={24} />} title="Fluxo de Caixa">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
                onClick={() => setExpandedCard('cashFlow')}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Expandir
              </Button>
            </CardHeader>
            <CardTotal value={cashFlow?.finalBalance ?? 0} color="emerald" label="Saldo Final" />
            {isLoading && (
              <div className="mt-6 flex justify-center">
                <Spinner size="lg" className="text-emerald-500" />
              </div>
            )}
            {!isLoading && cashFlow && (
              <div className="flex flex-col gap-3 mt-3">
                <CardStat label="Entradas" value={cashFlow.totalIncome} positive />
                <CardStat label="Saídas" value={cashFlow.totalExpense} negative />
                <div className="border-t border-border dark:border-border-dark my-2" />
                <CardStat
                  label="Saldo Final"
                  value={cashFlow.finalBalance}
                  highlight={cashFlow.finalBalance >= 0}
                />
              </div>
            )}
            {!isLoading && !cashFlow && <CardEmpty />}
          </CardContainer>

          {/* Contas a Receber */}
          <CardContainer color="amber" className="min-h-[420px]">
            <CardHeader icon={<TrendingUp size={24} />} title="Contas a Receber">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
                onClick={() => setExpandedCard('receivables')}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Expandir
              </Button>
            </CardHeader>
            <CardTotal
              value={receivables.reduce((acc, r) => acc + r.value, 0)}
              color="amber"
              label="Total Receber"
            />
            <div className="mt-3 flex flex-col justify-between min-h-[320px]">
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Spinner size="md" className="text-amber-500" />
                </div>
              ) : (
                <>
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr>
                        <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                        <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                        <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                      {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => {
                        const r = paginatedReceivables[idx];
                        const key = r ? r.id : `receivable-placeholder-${idx}`;
                        return r ? (
                          <tr key={key}>
                            <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                              {r.description}
                            </td>
                            <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                              R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                                {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
                              </BadgeStatus>
                            </td>
                          </tr>
                        ) : (
                          <tr key={key}>
                            <td className="px-2 py-1.5" colSpan={3}>
                              &nbsp;
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Paginação Recebíveis */}
                  {receivablesTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() => setReceivablesPage((p) => Math.max(1, p - 1))}
                        disabled={receivablesPage === 1}
                      >
                        Anterior
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Página {receivablesPage} de {receivablesTotalPages}
                      </span>
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() =>
                          setReceivablesPage((p) => Math.min(receivablesTotalPages, p + 1))
                        }
                        disabled={receivablesPage === receivablesTotalPages}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContainer>

          {/* Contas a Pagar */}
          <CardContainer color="rose" className="min-h-[420px]">
            <CardHeader icon={<TrendingDown size={24} />} title="Contas a Pagar">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
                onClick={() => setExpandedCard('payables')}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Expandir
              </Button>
            </CardHeader>
            <CardTotal
              value={payables.reduce((acc, p) => acc + p.value, 0)}
              color="rose"
              label="Total Pagar"
            />
            <div className="mt-3 flex flex-col justify-between min-h-[320px]">
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Spinner size="md" className="text-rose-500" />
                </div>
              ) : (
                <>
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr>
                        <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                        <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                        <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                      {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => {
                        const p = paginatedPayables[idx];
                        const key = p ? p.id : `payable-placeholder-${idx}`;
                        return p ? (
                          <tr key={key}>
                            <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                              {p.description}
                            </td>
                            <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                              R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                                {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                              </BadgeStatus>
                            </td>
                          </tr>
                        ) : (
                          <tr key={key}>
                            <td className="px-2 py-1.5" colSpan={3}>
                              &nbsp;
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Paginação Pagáveis */}
                  {payablesTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() => setPayablesPage((p) => Math.max(1, p - 1))}
                        disabled={payablesPage === 1}
                      >
                        Anterior
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Página {payablesPage} de {payablesTotalPages}
                      </span>
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() => setPayablesPage((p) => Math.min(payablesTotalPages, p + 1))}
                        disabled={payablesPage === payablesTotalPages}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContainer>

          {/* Cartões de Crédito */}
          <CardContainer color="violet" className="min-h-[420px]">
            <CardHeader icon={<CreditCard size={20} />} title="Cartões de Crédito">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
                onClick={() => setExpandedCard('creditCards')}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Expandir
              </Button>
            </CardHeader>
            <CardTotal value={activeBill?.total ?? 0} color="violet" label="Total Fatura" />
            {isLoading ? (
              <div className="mt-6 flex justify-center">
                <Spinner size="md" className="text-violet-500" />
              </div>
            ) : (
              <>
                <div className="flex gap-1.5 mb-3 mt-3">
                  {cards.map((card) => {
                    const isActive = activeCardTab === card.id;
                    let activeClass = '';
                    if (isActive) {
                      if (card.brand === 'nubank') {
                        activeClass = 'bg-[#8A05BE] text-white border-[#8A05BE]';
                      } else if (card.brand === 'itau') {
                        activeClass = 'bg-[#FF6900] text-white border-[#FF6900]';
                      } else {
                        activeClass = 'bg-primary-600 text-white dark:bg-primary-500';
                      }
                    } else {
                      activeClass =
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500';
                    }
                    return (
                      <button
                        key={card.id}
                        onClick={() => setActiveCardTab(card.id)}
                        className={`px-2 py-1 rounded font-medium border transition-colors text-[11px] ${activeClass}`}
                      >
                        <div className="flex items-center gap-1">
                          {card.brand === 'nubank' && <NubankIcon />}
                          {card.brand === 'itau' && <ItauIcon />}
                          {card.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-col justify-between min-h-[320px]">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr>
                        <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                        <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                        <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Categoria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                      {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => {
                        const t = paginatedCardTransactions[idx];
                        const key = t ? t.id : `card-placeholder-${idx}`;
                        return t ? (
                          <tr key={key}>
                            <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                              {t.description}
                            </td>
                            <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                              R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              <BadgeStatus
                                status={t.category === 'Parcelado' ? 'success' : 'default'}
                              >
                                {t.category}
                              </BadgeStatus>
                            </td>
                          </tr>
                        ) : (
                          <tr key={key}>
                            <td className="px-2 py-1.5" colSpan={3}>
                              &nbsp;
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Paginação Cartão */}
                  {cardTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() => setCardPage((p) => Math.max(1, p - 1))}
                        disabled={cardPage === 1}
                      >
                        Anterior
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Página {cardPage} de {cardTotalPages}
                      </span>
                      <button
                        className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                        onClick={() => setCardPage((p) => Math.min(cardTotalPages, p + 1))}
                        disabled={cardPage === cardTotalPages}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContainer>
        </div>
      </div>

      <Modal
        open={expandedCard !== null}
        onClose={() => setExpandedCard(null)}
        title={getExpandedCardTitle(expandedCard)}
        className="max-w-4xl max-h-[80vh] flex flex-col"
      >
        <div className="flex-1 overflow-auto">
          {expandedCard === 'cashFlow' && (
            <div className="space-y-3">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" className="text-emerald-500" />
                </div>
              )}
              {!isLoading && cashFlow && (
                <>
                  <CardStat label="Entradas" value={cashFlow.totalIncome} positive />
                  <CardStat label="Saídas" value={cashFlow.totalExpense} negative />
                  <div className="border-t border-border dark:border-border-dark my-3" />
                  <CardStat
                    label="Saldo Final"
                    value={cashFlow.finalBalance}
                    highlight={cashFlow.finalBalance >= 0}
                  />
                </>
              )}
              {!isLoading && !cashFlow && <CardEmpty />}
            </div>
          )}

          {expandedCard === 'receivables' && (
            <>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" className="text-amber-500" />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
                      <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
                      <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                    {receivables.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2 text-left text-text dark:text-text-dark">
                          {r.description}
                        </td>
                        <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                          R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                            {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
                          </BadgeStatus>
                        </td>
                      </tr>
                    ))}
                    {receivables.length === 0 && (
                      <tr>
                        <td
                          className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                          colSpan={3}
                        >
                          Nenhuma conta a receber neste período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}

          {expandedCard === 'payables' && (
            <>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" className="text-rose-500" />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
                      <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
                      <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                    {payables.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 text-left text-text dark:text-text-dark">
                          {p.description}
                        </td>
                        <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                          R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                            {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                          </BadgeStatus>
                        </td>
                      </tr>
                    ))}
                    {payables.length === 0 && (
                      <tr>
                        <td
                          className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                          colSpan={3}
                        >
                          Nenhuma conta a pagar neste período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}

          {expandedCard === 'creditCards' && (
            <>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" className="text-violet-500" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <CardStat label="Limite do cartão" value={activeCardLimit} highlight />
                    <CardStat label="Total da fatura" value={activeCardBillTotal} negative />
                    {activeCardAvailable !== null && (
                      <CardStat
                        label="Limite disponível"
                        value={activeCardAvailable}
                        positive={activeCardAvailable >= 0}
                        negative={activeCardAvailable < 0}
                      />
                    )}
                  </div>
                  {activeBill && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                      Vencimento:{' '}
                      <span className="font-medium text-text dark:text-text-dark">
                        {formatDate(activeBill.dueDate)}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cards.map((card) => {
                      const isActive = activeCardTab === card.id;
                      let activeClass = '';
                      if (isActive) {
                        if (card.brand === 'nubank') {
                          activeClass = 'bg-[#8A05BE] text-white border-[#8A05BE]';
                        } else if (card.brand === 'itau') {
                          activeClass = 'bg-[#FF6900] text-white border-[#FF6900]';
                        } else {
                          activeClass = 'bg-primary-600 text-white dark:bg-primary-500';
                        }
                      } else {
                        activeClass =
                          'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500';
                      }
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setActiveCardTab(card.id)}
                          className={`px-3 py-1.5 rounded font-medium border transition-colors text-xs ${activeClass}`}
                        >
                          <div className="flex items-center gap-1">
                            {card.brand === 'nubank' && <NubankIcon />}
                            {card.brand === 'itau' && <ItauIcon />}
                            {card.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto pr-1">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
                          <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
                          <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Categoria</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                        {activeBill?.transactions.map((t) => (
                          <tr key={t.id}>
                            <td className="px-3 py-2 text-left text-text dark:text-text-dark truncate">
                              {t.description}
                            </td>
                            <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                              R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <BadgeStatus
                                status={t.category === 'Parcelado' ? 'success' : 'default'}
                              >
                                {t.category}
                              </BadgeStatus>
                            </td>
                          </tr>
                        )) || null}
                        {(!activeBill || activeBill.transactions.length === 0) && (
                          <tr>
                            <td
                              className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                              colSpan={3}
                            >
                              Nenhuma transação de cartão neste período.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
    </ViewDefault>
  );
}
