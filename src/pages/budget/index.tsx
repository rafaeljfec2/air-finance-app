import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { MonthYearFilter } from '@/components/budget/MonthYearFilter';
import { mockCashFlows, mockReceivables, mockPayables, mockCreditCards } from '@/mocks/budget';
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import {
  CardContainer,
  CardHeader,
  CardStat,
  BadgeStatus,
  CardEmpty,
  CardTotal,
} from '@/components/budget';

export default function BudgetPage() {
  // Estado único para filtro central
  const [filter, setFilter] = useState({ month: '05', year: '2024' });
  const [activeCardTab, setActiveCardTab] = useState(mockCreditCards[0]?.id || '');

  // Helpers para filtrar mocks usando o filtro central
  const cashFlow = mockCashFlows.find((c) => c.month === `${filter.year}-${filter.month}`);
  const receivables = mockReceivables.filter((r) =>
    r.dueDate.startsWith(`${filter.year}-${filter.month}`),
  );
  const payables = mockPayables.filter((p) =>
    p.dueDate.startsWith(`${filter.year}-${filter.month}`),
  );
  const cards = mockCreditCards;
  const activeCard = cards.find((c) => c.id === activeCardTab);
  const activeBill = activeCard?.bills.find((b) => b.month === `${filter.year}-${filter.month}`);

  // Adicionar componentes SVG inline para Nubank e Itau
  const NubankIcon = () => (
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
  const ItauIcon = () => (
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

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
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
          <MonthYearFilter
            month={filter.month}
            year={filter.year}
            onChange={(month, year) => setFilter({ month, year })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {/* Fluxo de Caixa */}
          <CardContainer color="emerald" className="min-h-[420px]">
            <CardHeader icon={<Wallet size={24} />} title="Fluxo de Caixa" />
            <CardTotal value={cashFlow?.finalBalance ?? 0} color="emerald" label="Saldo Final" />
            {cashFlow ? (
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
            ) : (
              <CardEmpty />
            )}
          </CardContainer>

          {/* Contas a Receber */}
          <CardContainer color="amber" className="min-h-[420px]">
            <CardHeader icon={<TrendingUp size={24} />} title="Contas a Receber" />
            <CardTotal
              value={receivables.reduce((acc, r) => acc + r.value, 0)}
              color="amber"
              label="Total Receber"
            />
            <div className="mt-3">
              <table className="w-full text-[11px]">
                <thead>
                  <tr>
                    <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                    <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                    <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                  {receivables.map((r) => (
                    <tr key={r.id}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContainer>

          {/* Contas a Pagar */}
          <CardContainer color="rose" className="min-h-[420px]">
            <CardHeader icon={<TrendingDown size={24} />} title="Contas a Pagar" />
            <CardTotal
              value={payables.reduce((acc, p) => acc + p.value, 0)}
              color="rose"
              label="Total Pagar"
            />
            <div className="mt-3">
              <table className="w-full text-[11px]">
                <thead>
                  <tr>
                    <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                    <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                    <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                  {payables.map((p) => (
                    <tr key={p.id}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContainer>

          {/* Cartões de Crédito */}
          <CardContainer color="violet" className="min-h-[420px]">
            <CardHeader icon={<CreditCard size={20} />} title="Cartões de Crédito" />
            <CardTotal value={activeBill?.total ?? 0} color="violet" label="Total Fatura" />
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
            <div>
              <table className="w-full text-[11px]">
                <thead>
                  <tr>
                    <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                    <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                    <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                  {activeBill?.transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                        {t.description}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                        R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                          {t.category}
                        </BadgeStatus>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContainer>
        </div>
      </div>
    </ViewDefault>
  );
}
