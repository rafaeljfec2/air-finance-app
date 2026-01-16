import { Button } from '@/components/ui/button';
import { useCompanyStore } from '@/contexts/companyContext';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { Category, getCategories } from '@/services/categoryService';
import { getTransactions, Transaction, updateTransaction } from '@/services/transactionService';
import { BadgeCheck, Check, Edit2, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AiClassificationPage() {
  const { companyId } = useCompanyStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      Promise.all([
        getTransactions(companyId, { classificationStatus: 'pending' }),
        getCategories(companyId),
      ])
        .then(([txs, cats]) => {
          setTransactions(txs);
          setCategories(cats);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [companyId]);

  const getCategoryName = (id?: string) => {
    if (!id) return 'Sem categoria';
    return categories.find((c) => c.id === id)?.name || 'Desconhecida';
  };

  const getCategoryColor = (id?: string) => {
    if (!id) return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    // Simplified color mapping if real categories don't have tailwind classes (they usually have hex)
    // For now assuming existing logic-like behavior or just a badge.
    // The previous mock used tailwind classes. The real category has `color` (hex).
    // We can use a style attribute for custom colors.
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  async function handleAccept(tx: Transaction) {
    if (!tx.suggestedCategoryId) return;
    try {
      await updateTransaction(companyId, tx.id, {
        classificationStatus: 'accepted',
        categoryId: tx.suggestedCategoryId,
      });
      setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
      setFeedback({ id: tx.id, message: 'Obrigado! Sua escolha ajuda a IA a melhorar.' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to accept:', error);
    }
  }

  async function handleEdit(tx: Transaction, newCategoryId: string) {
    try {
      await updateTransaction(companyId, tx.id, {
        classificationStatus: 'edited',
        categoryId: newCategoryId,
      });
      setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
      setEditingId(null);
      setFeedback({ id: tx.id, message: 'Categoria editada. Sua escolha ajuda a IA a melhorar.' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to edit:', error);
    }
  }

  async function handleReject(tx: Transaction) {
    try {
      await updateTransaction(companyId, tx.id, {
        classificationStatus: 'rejected',
        // Optional: clear category if rejected? for now keeping as is or 'Sem categoria' if consistent.
        // Assuming reject means "not this suggestion", but creates a task to classify manually later?
        // Or specific logic. The UI removed it from list.
      });
      setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
      setFeedback({ id: tx.id, message: 'Sugestão recusada. Obrigado pelo feedback!' });
      setTimeout(() => setFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  }

  if (loading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto w-full px-0 sm:px-0 overflow-x-hidden">
        <div className="h-fit w-full bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 overflow-x-hidden flex flex-col items-center">
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
            
            {transactions.length === 0 ? (
              <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow border border-border dark:border-border-dark">
                <p className="text-lg text-gray-500">Nenhuma transação pendente de classificação.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={cn(
                      'relative bg-white dark:bg-gray-900 shadow-md rounded-xl p-5 flex flex-col gap-2 mb-2 transition-all',
                      'border border-border dark:border-border-dark',
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
                        <span className="text-xs text-gray-400">
                           ({Math.round((tx.classificationConfidence || 0) * 100)}%)
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-lg font-semibold',
                          tx.value < 0 ? 'text-red-500' : 'text-green-500',
                        )}
                      >
                        {tx.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    {/* Detalhes */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getCategoryColor(tx.suggestedCategoryId)
                        )}
                        style={
                           tx.suggestedCategoryId 
                             ? { 
                                 backgroundColor: categories.find(c => c.id === tx.suggestedCategoryId)?.color + '20', // 20% opacity
                                 color: categories.find(c => c.id === tx.suggestedCategoryId)?.color 
                               }
                             : {}
                        }
                      >
                        {getCategoryName(tx.suggestedCategoryId)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(tx.paymentDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {/* Ações */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {editingId !== tx.id && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 shadow-none"
                            onClick={() => handleAccept(tx)}
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
                            onClick={() => handleReject(tx)}
                            title="Recusar sugestão"
                          >
                            <X className="w-4 h-4" /> Recusar
                          </Button>
                        </>
                      )}
                      {editingId === tx.id && (
                        <select
                          className="ml-1 rounded-md border border-border dark:border-border-dark bg-background dark:bg-background-dark px-2 py-1 text-sm max-w-[200px]"
                          value={tx.suggestedCategoryId || ''}
                          onChange={(e) => handleEdit(tx, e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
