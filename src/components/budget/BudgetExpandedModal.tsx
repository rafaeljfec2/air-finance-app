import { BadgeStatus, CardEmpty, CardStat } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { useTransactions } from '@/hooks/useTransactions';
import { useCompanyStore } from '@/stores/company';
import type { CashFlow, CreditCard, CreditCardBill, Payable, Receivable } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

export type ExpandedCard = 'cashFlow' | 'receivables' | 'payables' | 'creditCards' | null;

function getExpandedCardTitle(expandedCard: ExpandedCard): string | undefined {
  if (expandedCard === 'cashFlow') return 'Fluxo de Caixa';
  if (expandedCard === 'receivables') return 'Contas a Receber';
  if (expandedCard === 'payables') return 'Contas a Pagar';
  if (expandedCard === 'creditCards') return 'Cartões de Crédito';
  return undefined;
}

interface BudgetExpandedModalProps {
  expandedCard: ExpandedCard;
  isLoading: boolean;
  cashFlow: CashFlow | null;
  receivables: Receivable[];
  payables: Payable[];
  cards: CreditCard[];
  activeBill: CreditCardBill | undefined;
  activeCardLimit: number;
  activeCardBillTotal: number;
  activeCardAvailable: number | null;
  activeCardTab: string;
  onActiveCardChange: (cardId: string) => void;
  onClose: () => void;
}

export function BudgetExpandedModal({
  expandedCard,
  isLoading,
  cashFlow,
  receivables,
  payables,
  cards,
  activeBill,
  activeCardLimit,
  activeCardBillTotal,
  activeCardAvailable,
  activeCardTab,
  onActiveCardChange,
  onClose,
}: Readonly<BudgetExpandedModalProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const queryClient = useQueryClient();
  const { updateTransaction, isUpdating } = useTransactions(companyId);

  // Estado para controlar qual item está sendo editado
  const [editingPayableId, setEditingPayableId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focar no input quando começar a edição
  useEffect(() => {
    if (editingPayableId && inputRef.current) {
      // Usar setTimeout para garantir que o DOM está atualizado
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [editingPayableId]);

  const handleDoubleClick = (payable: Payable) => {
    setEditingPayableId(payable.id);
    setEditingValue(payable.value.toFixed(2).replace('.', ','));
  };

  const handleSave = async (payableId: string) => {
    const numericValue = Number.parseFloat(editingValue.replace(/,/g, '.'));

    if (Number.isNaN(numericValue) || numericValue < 0) {
      toast({
        title: 'Valor inválido',
        description: 'Digite um valor válido maior ou igual a zero.',
        type: 'error',
      });
      return;
    }

    try {
      await Promise.resolve(
        updateTransaction({
          id: payableId,
          data: { value: numericValue },
        }),
      );

      // Invalidar cache do budget para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['budget', companyId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', companyId] });

      toast({
        title: 'Valor atualizado',
        description: 'O valor foi atualizado com sucesso.',
        type: 'success',
      });

      setEditingPayableId(null);
      setEditingValue('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao atualizar',
        description: `Não foi possível atualizar o valor: ${errorMessage}`,
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    setEditingPayableId(null);
    setEditingValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, payableId: string) => {
    if (e.key === 'Enter') {
      handleSave(payableId);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  return (
    <Modal
      open={expandedCard !== null}
      onClose={onClose}
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
                      <td
                        className="px-3 py-2 text-right font-medium whitespace-nowrap cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(p)}
                        title="Clique duas vezes para editar"
                      >
                        {editingPayableId === p.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm">R$</span>
                            <Input
                              ref={inputRef}
                              type="text"
                              value={editingValue}
                              onChange={(e) => {
                                let value = e.target.value;
                                // Permite apenas números e vírgula
                                value = value.replace(/[^\d,]/g, '');
                                // Permite apenas uma vírgula
                                const parts = value.split(',');
                                if (parts.length > 2) {
                                  value = parts[0] + ',' + parts.slice(1).join('');
                                }
                                setEditingValue(value);
                              }}
                              onBlur={() => {
                                // Pequeno delay para permitir que eventos de clique sejam processados
                                setTimeout(() => {
                                  if (editingPayableId === p.id) {
                                    handleSave(p.id);
                                  }
                                }, 200);
                              }}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                handleKeyDown(e, p.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-32 h-8 text-right font-medium bg-background dark:bg-background-dark border-primary-500 focus:ring-2 focus:ring-primary-500"
                              disabled={isUpdating}
                            />
                          </div>
                        ) : (
                          `R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        )}
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
                        onClick={() => onActiveCardChange(card.id)}
                        className={`px-3 py-1.5 rounded font-medium border transition-colors text-xs ${activeClass}`}
                      >
                        <div className="flex items-center gap-1">
                          <CreditCardBrandIcon brand={card.brand} />
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
  );
}
