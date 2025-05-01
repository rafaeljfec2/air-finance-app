import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transacao } from '@/types/transacao';
import { Card } from '@/components/ui/Card';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onEditar?: (transacao: Transacao) => void;
  onRemover?: (id: string) => void;
}

export function ListaTransacoes({ transacoes, onEditar, onRemover }: ListaTransacoesProps) {
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
      {transacoes.map(transacao => (
        <div
          key={transacao.id}
          className={`
            cursor-pointer transition-all duration-200
            ${transacaoSelecionada === transacao.id ? 'ring-2 ring-primary' : ''}
          `}
          onClick={() =>
            setTransacaoSelecionada(transacaoSelecionada === transacao.id ? null : transacao.id)
          }
        >
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: transacao.categoria.cor + '20' }}
                  >
                    {transacao.tipo === 'RECEITA' ? (
                      <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {transacao.descricao}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transacao.categoria.nome}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`
                    font-medium
                    ${
                      transacao.tipo === 'RECEITA'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  `}
                  >
                    {transacao.tipo === 'RECEITA' ? '+' : '-'}
                    {formatarMoeda(transacao.valor)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatarData(transacao.data)}
                  </p>
                </div>
              </div>

              {transacaoSelecionada === transacao.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {transacao.observacao && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {transacao.observacao}
                    </p>
                  )}

                  <div className="flex justify-end space-x-2">
                    {onEditar && (
                      <button
                        onClick={e => {
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
                        onClick={e => {
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
      ))}
    </div>
  );
}
