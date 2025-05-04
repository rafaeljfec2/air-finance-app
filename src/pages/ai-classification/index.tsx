import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Edit2, X, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewDefault } from '@/layouts/ViewDefault';

const mockCategories = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Educação',
  'Moradia',
  'Outros',
];

const categoryColors: Record<string, string> = {
  Alimentação: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Transporte: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Saúde: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  Lazer: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Educação: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Moradia: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  Outros: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const mockTransactions = [
  {
    id: '1',
    description: 'Supermercado Extra',
    amount: -150.25,
    date: '2024-06-10',
    iaCategory: 'Alimentação',
    userCategory: '',
    status: 'pending', // 'accepted', 'edited', 'rejected'
  },
  {
    id: '2',
    description: 'Uber',
    amount: -32.9,
    date: '2024-06-09',
    iaCategory: 'Transporte',
    userCategory: '',
    status: 'pending',
  },
  {
    id: '3',
    description: 'Farmácia São João',
    amount: -58.0,
    date: '2024-06-08',
    iaCategory: 'Saúde',
    userCategory: '',
    status: 'pending',
  },
  {
    id: '4',
    description: 'Netflix',
    amount: -39.9,
    date: '2024-06-07',
    iaCategory: 'Lazer',
    userCategory: '',
    status: 'pending',
  },
];

export function AiClassificationPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null);

  function handleAccept(id: string) {
    setTransactions((txs) =>
      txs.map((tx) =>
        tx.id === id ? { ...tx, status: 'accepted', userCategory: tx.iaCategory } : tx,
      ),
    );
    setFeedback({ id, message: 'Obrigado! Sua escolha ajuda a IA a melhorar.' });
    setTimeout(() => setFeedback(null), 2000);
  }

  function handleEdit(id: string, newCategory: string) {
    setTransactions((txs) =>
      txs.map((tx) => (tx.id === id ? { ...tx, status: 'edited', userCategory: newCategory } : tx)),
    );
    setEditingId(null);
    setFeedback({ id, message: 'Categoria editada. Sua escolha ajuda a IA a melhorar.' });
    setTimeout(() => setFeedback(null), 2000);
  }

  function handleReject(id: string) {
    setTransactions((txs) =>
      txs.map((tx) => (tx.id === id ? { ...tx, status: 'rejected', userCategory: '' } : tx)),
    );
    setFeedback({ id, message: 'Sugestão recusada. Obrigado pelo feedback!' });
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <ViewDefault>
      <div className="min-h-screen bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-arrow mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-brand-arrow" /> Classificação Inteligente de
              Transações
            </h1>
            <p className="text-text/70 dark:text-text-dark/70 text-lg max-w-2xl mx-auto">
              Revise as transações recentes e confirme, edite ou recuse a sugestão de categoria
              feita pela IA. Sua escolha ajuda a IA a ficar cada vez mais precisa!
            </p>
          </div>
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={cn(
                  'relative bg-white dark:bg-gray-900 shadow-md rounded-xl p-5 flex flex-col gap-2 mb-2 transition-all',
                  'border border-border dark:border-border-dark',
                  tx.status === 'accepted'
                    ? 'ring-2 ring-green-400'
                    : tx.status === 'edited'
                      ? 'ring-2 ring-blue-400'
                      : tx.status === 'rejected'
                        ? 'ring-2 ring-red-400'
                        : '',
                )}
              >
                {/* Feedback visual */}
                {feedback?.id === tx.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow animate-bounce z-10">
                    {feedback.message}
                  </div>
                )}
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {tx.description}
                    </span>
                    <span className="bg-brand-arrow/10 text-brand-arrow px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border border-brand-arrow/20">
                      <BadgeCheck className="w-4 h-4" /> Sugestão IA
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-lg font-semibold',
                      tx.amount < 0 ? 'text-red-500' : 'text-green-500',
                    )}
                  >
                    {tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                {/* Detalhes */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      categoryColors[tx.userCategory || tx.iaCategory] || categoryColors['Outros'],
                    )}
                  >
                    {tx.userCategory || tx.iaCategory}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {/* Ações */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {tx.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 shadow-none"
                        onClick={() => handleAccept(tx.id)}
                        title="Aceitar sugestão"
                      >
                        <Check className="w-4 h-4" /> Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 shadow-none"
                        onClick={() => setEditingId(tx.id)}
                        title="Editar categoria"
                      >
                        <Edit2 className="w-4 h-4" /> Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 shadow-none"
                        onClick={() => handleReject(tx.id)}
                        title="Recusar sugestão"
                      >
                        <X className="w-4 h-4" /> Recusar
                      </Button>
                    </>
                  )}
                  {editingId === tx.id && tx.status === 'pending' && (
                    <select
                      className="ml-1 rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark px-2 py-1 text-sm"
                      value={tx.userCategory || tx.iaCategory}
                      onChange={(e) => handleEdit(tx.id, e.target.value)}
                    >
                      {mockCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
