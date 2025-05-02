import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { MonthYearFilter } from '@/components/budget/MonthYearFilter';
import { mockCashFlows, mockReceivables, mockPayables, mockCreditCards } from '@/mocks/budget';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BadgeCheck,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { CardContainer, CardHeader, CardStat, BadgeStatus, CardEmpty } from '@/components/budget';

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
        <h1 className="text-3xl font-extrabold text-text dark:text-text-dark mb-10">Orçamento</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 auto-rows-fr">
          {/* Fluxo de Caixa */}
          <CardContainer color="emerald" className="min-h-[420px]">
            <CardHeader icon={<Wallet size={28} />} title="Fluxo de Caixa">
              <MonthYearFilter
                month={cashFlowFilter.month}
                year={cashFlowFilter.year}
                onChange={(month, year) => setCashFlowFilter({ month, year })}
              />
            </CardHeader>
            {cashFlow ? (
              <div className="flex flex-col gap-4 mt-4">
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
            <CardHeader icon={<TrendingUp size={28} />} title="Contas a Receber">
              <MonthYearFilter
                month={receivableFilter.month}
                year={receivableFilter.year}
                onChange={(month, year) => setReceivableFilter({ month, year })}
              />
            </CardHeader>
            {receivables.length > 0 ? (
              <ul className="mt-4 divide-y divide-border dark:divide-border-dark">
                {receivables.map((r, i) => (
                  <li
                    key={r.id}
                    className={`flex justify-between items-center py-2 ${i % 2 === 0 ? 'bg-background/50 dark:bg-background-dark/50' : ''}`}
                  >
                    <span>{r.description}</span>
                    <span className="flex items-center gap-2">
                      <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                        {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
                      </BadgeStatus>
                      <span className="font-semibold">
                        R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </span>
                  </li>
                ))}
                <li className="flex justify-between items-center py-2 font-bold border-t border-border dark:border-border-dark mt-2">
                  <span>Total Receber</span>
                  <span>
                    R${' '}
                    {receivables
                      .reduce((acc, r) => acc + r.value, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </li>
              </ul>
            ) : (
              <CardEmpty />
            )}
          </CardContainer>

          {/* Contas a Pagar */}
          <CardContainer color="rose" className="min-h-[420px]">
            <CardHeader icon={<TrendingDown size={28} />} title="Contas a Pagar">
              <MonthYearFilter
                month={payableFilter.month}
                year={payableFilter.year}
                onChange={(month, year) => setPayableFilter({ month, year })}
              />
            </CardHeader>
            {payables.length > 0 ? (
              <ul className="mt-4 divide-y divide-border dark:divide-border-dark">
                {payables.map((p, i) => (
                  <li
                    key={p.id}
                    className={`flex justify-between items-center py-2 ${i % 2 === 0 ? 'bg-background/50 dark:bg-background-dark/50' : ''}`}
                  >
                    <span>{p.description}</span>
                    <span className="flex items-center gap-2">
                      <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                        {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </BadgeStatus>
                      <span className="font-semibold">
                        R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </span>
                  </li>
                ))}
                <li className="flex justify-between items-center py-2 font-bold border-t border-border dark:border-border-dark mt-2">
                  <span>Total Pagar</span>
                  <span>
                    R${' '}
                    {payables
                      .reduce((acc, p) => acc + p.value, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </li>
              </ul>
            ) : (
              <CardEmpty />
            )}
          </CardContainer>

          {/* Cartões de Crédito */}
          <CardContainer color="violet" className="min-h-[420px]">
            <CardHeader icon={<CreditCard size={28} />} title="Cartões de Crédito">
              <MonthYearFilter
                month={cardFilter.month}
                year={cardFilter.year}
                onChange={(month, year) => setCardFilter({ month, year })}
              />
            </CardHeader>
            <div className="flex gap-2 mb-4 mt-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCardTab(card.id)}
                  className={`px-3 py-1 rounded font-medium border transition-colors ${activeCardTab === card.id ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary-500'}`}
                >
                  {card.name}
                </button>
              ))}
            </div>
            {activeBill ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Fatura</span>
                  <span className="text-lg font-bold">
                    R$ {activeBill.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Vencimento: {activeBill.dueDate}</span>
                  <span>
                    Status:{' '}
                    {activeBill.status === 'PAID'
                      ? 'Paga'
                      : activeBill.status === 'CLOSED'
                        ? 'Fechada'
                        : 'Aberta'}
                  </span>
                </div>
                {/* Barra de progresso de uso do limite */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded mt-2 mb-2">
                  <div
                    className="h-2 rounded bg-primary-500 transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((activeBill.total / (activeCard?.limit || 1)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Limite: R${' '}
                  {activeCard?.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <ul className="divide-y divide-border dark:divide-border-dark">
                  {activeBill.transactions.map((t, i) => (
                    <li
                      key={t.id}
                      className={`flex justify-between items-center py-2 ${i % 2 === 0 ? 'bg-background/50 dark:bg-background-dark/50' : ''}`}
                    >
                      <span>{t.description}</span>
                      <span className="flex items-center gap-2">
                        <BadgeStatus status={t.category === 'Parcelado' ? 'success' : 'default'}>
                          {t.category}
                        </BadgeStatus>
                        <span className="font-semibold">
                          R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </span>
                    </li>
                  ))}
                  <li className="flex justify-between items-center py-2 font-bold border-t border-border dark:border-border-dark mt-2">
                    <span>Total Fatura</span>
                    <span>
                      R$ {activeBill.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <CardEmpty />
            )}
          </CardContainer>
        </div>
      </div>
    </ViewDefault>
  );
}
