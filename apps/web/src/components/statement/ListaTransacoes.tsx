import { Transaction } from '@/types/transaction';
import { useState } from 'react';
import { TransactionCard } from './TransactionCard';

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

  const handleToggle = (transactionId: string) => {
    setTransacaoSelecionada((current) => (current === transactionId ? null : transactionId));
  };

  if (transacoes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transacoes.map((transacao) => (
        <TransactionCard
          key={transacao.id}
          transaction={transacao}
          isSelected={transacaoSelecionada === transacao.id}
          onToggle={() => handleToggle(transacao.id)}
          onEdit={onEditar}
          onRemove={onRemover}
        />
      ))}
    </div>
  );
}
