import { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { MonthYearFilter } from '@/components/budget/MonthYearFilter';
import { mockCashFlows, mockReceivables, mockPayables, mockCreditCards } from '@/mocks/budget';

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-8">Orçamento</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Fluxo de Caixa */}
          <div className="bg-card dark:bg-card-dark rounded-lg shadow p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Fluxo de Caixa
              </h2>
              <MonthYearFilter
                month={cashFlowFilter.month}
                year={cashFlowFilter.year}
                onChange={(month, year) => setCashFlowFilter({ month, year })}
              />
            </div>
            {cashFlow ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saldo Inicial</span>
                  <span className="font-medium">
                    R${' '}
                    {cashFlow.initialBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Entradas</span>
                  <span>
                    + R${' '}
                    {cashFlow.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                  <span>Saídas</span>
                  <span>
                    - R${' '}
                    {cashFlow.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold mt-2">
                  <span>Saldo Final</span>
                  <span
                    className={
                      cashFlow.finalBalance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    R$ {cashFlow.finalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sem dados para o período.
              </div>
            )}
          </div>

          {/* Contas a Receber */}
          <div className="bg-card dark:bg-card-dark rounded-lg shadow p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Contas a Receber
              </h2>
              <MonthYearFilter
                month={receivableFilter.month}
                year={receivableFilter.year}
                onChange={(month, year) => setReceivableFilter({ month, year })}
              />
            </div>
            <div className="space-y-2 flex-1">
              {receivables.length > 0 ? (
                receivables.map((r) => (
                  <div key={r.id} className="flex justify-between text-sm items-center">
                    <span>{r.description}</span>
                    <span
                      className={
                        r.status === 'RECEIVED'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }
                    >
                      R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sem dados para o período.
                </div>
              )}
            </div>
          </div>

          {/* Contas a Pagar */}
          <div className="bg-card dark:bg-card-dark rounded-lg shadow p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Contas a Pagar
              </h2>
              <MonthYearFilter
                month={payableFilter.month}
                year={payableFilter.year}
                onChange={(month, year) => setPayableFilter({ month, year })}
              />
            </div>
            <div className="space-y-2 flex-1">
              {payables.length > 0 ? (
                payables.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm items-center">
                    <span>{p.description}</span>
                    <span
                      className={
                        p.status === 'PAID'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sem dados para o período.
                </div>
              )}
            </div>
          </div>

          {/* Cartões de Crédito */}
          <div className="bg-card dark:bg-card-dark rounded-lg shadow p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Cartões de Crédito
              </h2>
              <MonthYearFilter
                month={cardFilter.month}
                year={cardFilter.year}
                onChange={(month, year) => setCardFilter({ month, year })}
              />
            </div>
            <div className="flex gap-2 mb-4">
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
              <div className="space-y-2 flex-1">
                <div className="flex justify-between text-sm">
                  <span>Fatura</span>
                  <span
                    className={
                      activeBill.status === 'PAID'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }
                  >
                    R$ {activeBill.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
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
                <div className="mt-2">
                  <div className="text-xs font-semibold mb-1">Transações</div>
                  {activeBill.transactions.length > 0 ? (
                    <ul className="space-y-1">
                      {activeBill.transactions.map((t) => (
                        <li key={t.id} className="flex justify-between text-xs">
                          <span>{t.description}</span>
                          <span>
                            R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sem transações.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sem fatura para o período.
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
