import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface ListaTransacoesProps {
  transacoes: Transaction[];
  onEditar?: (transacao: Transaction) => void;
  onRemover?: (id: string) => void;
}

export function ListaTransacoes({
  transacoes,
  onEditar,
  onRemover,
}: Readonly<ListaTransacoesProps>) {
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<string | null>(null);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: Date) => {
    return format(new Date(data), 'dd MMM yyyy', { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      {transacoes.map((transacao) => {
        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setTransacaoSelecionada(transacaoSelecionada === transacao.id ? null : transacao.id);
          }
        };

        return (
          <div
            key={transacao.id}
            role="button"
            tabIndex={0}
            className={`
            cursor-pointer transition-all duration-200
            ${transacaoSelecionada === transacao.id ? 'ring-2 ring-primary' : ''}
          `}
            onClick={() =>
              setTransacaoSelecionada(transacaoSelecionada === transacao.id ? null : transacao.id)
            }
            onKeyDown={handleKeyDown}
          >
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: transacao.category.color + '20' }}
                    >
                      {transacao.type === 'INCOME' ? (
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-500" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {transacao.description}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transacao.category.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`
                    font-medium
                    ${
                      transacao.type === 'INCOME'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  `}
                    >
                      {transacao.type === 'INCOME' ? '+' : '-'}
                      {formatarMoeda(transacao.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatarData(new Date(transacao.date))}
                    </p>
                  </div>
                </div>

                {transacaoSelecionada === transacao.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {transacao.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {transacao.note}
                      </p>
                    )}

                    <div className="flex justify-end space-x-2">
                      {onEditar && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditar(transacao);
                          }}
                          className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Editar
                        </button>
                      )}

                      {onRemover && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemover(transacao.id);
                          }}
                          className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
