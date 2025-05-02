import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
    amount: -32.90,
    date: '2024-06-09',
    iaCategory: 'Transporte',
    userCategory: '',
    status: 'pending',
  },
  {
    id: '3',
    description: 'Farmácia São João',
    amount: -58.00,
    date: '2024-06-08',
    iaCategory: 'Saúde',
    userCategory: '',
    status: 'pending',
  },
  {
    id: '4',
    description: 'Netflix',
    amount: -39.90,
    date: '2024-06-07',
    iaCategory: 'Lazer',
    userCategory: '',
    status: 'pending',
  },
];

export default function AiClassificationPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null);

  function handleAccept(id: string) {
    setTransactions(txs => txs.map(tx => tx.id === id ? { ...tx, status: 'accepted', userCategory: tx.iaCategory } : tx));
    setFeedback({ id, message: 'Obrigado! Sua escolha ajuda a IA a melhorar.' });
    setTimeout(() => setFeedback(null), 2000);
  }

  function handleEdit(id: string, newCategory: string) {
    setTransactions(txs => txs.map(tx => tx.id === id ? { ...tx, status: 'edited', userCategory: newCategory } : tx));
    setEditingId(null);
    setFeedback({ id, message: 'Categoria editada. Sua escolha ajuda a IA a melhorar.' });
    setTimeout(() => setFeedback(null), 2000);
  }

  function handleReject(id: string) {
    setTransactions(txs => txs.map(tx => tx.id === id ? { ...tx, status: 'rejected', userCategory: '' } : tx));
    setFeedback({ id, message: 'Sugestão recusada. Obrigado pelo feedback!' });
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <ViewDefault>
        <div className="min-h-screen bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
            <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-arrow mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-7 h-7 text-brand-arrow" /> Classificação Inteligente de Transações
            </h1>
            <p className="text-text/70 dark:text-text-dark/70 text-lg max-w-2xl mx-auto">
                Revise as transações recentes e confirme, edite ou recuse a sugestão de categoria feita pela IA. Sua escolha ajuda a IA a ficar cada vez mais precisa!
            </p>
            </div>
            <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border dark:divide-border-dark">
                {transactions.map(tx => (
                <div
                    key={tx.id}
                    className={cn(
                    'flex flex-col md:flex-row md:items-center gap-4 px-4 py-3 relative group transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-gray-900/40',
                    'border-l-4',
                    tx.status === 'accepted' ? 'border-green-500' : tx.status === 'edited' ? 'border-blue-500' : tx.status === 'rejected' ? 'border-red-500' : 'border-transparent'
                    )}
                >
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-base text-gray-900 dark:text-white truncate">{tx.description}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-brand-arrow/5 text-brand-arrow border border-brand-arrow/20">
                        <BadgeCheck className="w-4 h-4 mr-1" /> Sugestão IA
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                        <span className={cn('font-semibold', tx.amount < 0 ? 'text-red-500' : 'text-green-500')}>{tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <span className="flex items-center gap-1">
                        Categoria:
                        {editingId === tx.id ? (
                            <select
                            className="ml-1 rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark px-2 py-1 text-sm"
                            value={tx.userCategory || tx.iaCategory}
                            onChange={e => handleEdit(tx.id, e.target.value)}
                            >
                            {mockCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            </select>
                        ) : (
                            <span className={cn('ml-1 px-2 py-0.5 rounded bg-brand-arrow/10 text-brand-arrow font-medium', tx.status === 'edited' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300')}>{tx.userCategory || tx.iaCategory}</span>
                        )}
                        </span>
                    </div>
                    </div>
                    <div className="flex gap-2 md:flex-col md:gap-2 items-center md:items-end min-w-[180px]">
                    {tx.status === 'pending' && (
                        <>
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => handleAccept(tx.id)} title="Aceitar sugestão">
                            <Check className="w-4 h-4 mr-1" /> Aceitar
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm" onClick={() => setEditingId(tx.id)} title="Editar categoria">
                            <Edit2 className="w-4 h-4 mr-1" /> Editar
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm" onClick={() => handleReject(tx.id)} title="Recusar sugestão">
                            <X className="w-4 h-4 mr-1" /> Recusar
                        </Button>
                        </>
                    )}
                    {tx.status === 'accepted' && feedback?.id === tx.id && (
                        <span className="text-green-600 text-xs font-medium flex items-center gap-1 animate-pulse"><Check className="w-4 h-4" /> {feedback.message}</span>
                    )}
                    {tx.status === 'edited' && feedback?.id === tx.id && (
                        <span className="text-blue-600 text-xs font-medium flex items-center gap-1 animate-pulse"><Edit2 className="w-4 h-4" /> {feedback.message}</span>
                    )}
                    {tx.status === 'rejected' && feedback?.id === tx.id && (
                        <span className="text-red-600 text-xs font-medium flex items-center gap-1 animate-pulse"><X className="w-4 h-4" /> {feedback.message}</span>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </Card>
        </div>
        </div>
    </ViewDefault>                
  );
} 