import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface TransactionCardProps {
  transaction: Transaction;
  isSelected: boolean;
  onToggle: () => void;
  onEdit?: (transaction: Transaction) => void;
  onRemove?: (id: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: Date): string => {
  return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
};

export function TransactionCard({
  transaction,
  isSelected,
  onToggle,
  onEdit,
  onRemove,
}: Readonly<TransactionCardProps>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const isIncome = transaction.type === 'INCOME';

  return (
    <div className={isSelected ? 'ring-2 ring-primary rounded-lg' : ''}>
      <button
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-label={`${isIncome ? 'Receita' : 'Despesa'}: ${transaction.description}`}
        aria-expanded={isSelected}
        className="w-full text-left cursor-pointer transition-all duration-200"
      >
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: transaction.category.color + '20' }}
                >
                  {isIncome ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-medium ${
                    isIncome
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(new Date(transaction.date))}
                </p>
              </div>
            </div>

            {isSelected && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {transaction.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {transaction.note}
                  </p>
                )}

                {(onEdit || onRemove) && (
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction);
                        }}
                        className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Editar
                      </button>
                    )}

                    {onRemove && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(transaction.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </button>
    </div>
  );
}
