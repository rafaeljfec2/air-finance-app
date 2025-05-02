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
  // Estados de filtro para cada card
  const [cashFlowFilter, setCashFlowFilter] = useState({ month: '05', year: '2024' });
  const [receivableFilter, setReceivableFilter] = useState({ month: '05', year: '2024' });
  const [payableFilter, setPayableFilter] = useState({ month: '05', year: '2024' });
  const [cardFilter, setCardFilter] = useState({ month: '05', year: '2024' });
  const [activeCardTab, setActiveCardTab] = useState(mockCreditCards[0]?.id || '');

  // Helpers para filtrar mocks
  const cashFlow = mockCashFlows.find(
    (c) => c.month === `${cashFlowFilter.year}-${cashFlowFilter.month}`,
  );
  const receivables = mockReceivables.filter((r) =>
    r.dueDate.startsWith(`${receivableFilter.year}-${receivableFilter.month}`),
  );
  const payables = mockPayables.filter((p) =>
    p.dueDate.startsWith(`${payableFilter.year}-${payableFilter.month}`),
  );
  const cards = mockCreditCards;
  const activeCard = cards.find((c) => c.id === activeCardTab);
  const activeBill = activeCard?.bills.find(
    (b) => b.month === `${cardFilter.year}-${cardFilter.month}`,
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {/* Fluxo de Caixa */}
          <CardContainer color="emerald" className="min-h-[420px]">
            <CardHeader icon={<Wallet size={24} />} title="Fluxo de Caixa">
              <MonthYearFilter
                month={cashFlowFilter.month}
                year={cashFlowFilter.year}
                onChange={(month, year) => setCashFlowFilter({ month, year })}
              />
            </CardHeader>
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
            <CardHeader icon={<TrendingUp size={24} />} title="Contas a Receber">
              <MonthYearFilter
                month={receivableFilter.month}
                year={receivableFilter.year}
                onChange={(month, year) => setReceivableFilter({ month, year })}
              />
            </CardHeader>
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
            <CardHeader icon={<TrendingDown size={24} />} title="Contas a Pagar">
              <MonthYearFilter
                month={payableFilter.month}
                year={payableFilter.year}
                onChange={(month, year) => setPayableFilter({ month, year })}
              />
            </CardHeader>
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
            <CardHeader icon={<CreditCard size={24} />} title="Cartões de Crédito">
              <MonthYearFilter
                month={cardFilter.month}
                year={cardFilter.year}
                onChange={(month, year) => setCardFilter({ month, year })}
              />
            </CardHeader>
            <CardTotal value={activeBill?.total ?? 0} color="violet" label="Total Fatura" />
            <div className="flex gap-1.5 mb-3 mt-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCardTab(card.id)}
                  className={`px-2 py-1 rounded font-medium border transition-colors text-[11px] ${activeCardTab === card.id ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500'}`}
                >
                  {card.name}
                </button>
              ))}
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
