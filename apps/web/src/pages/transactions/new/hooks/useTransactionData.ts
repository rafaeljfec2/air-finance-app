import { useEffect, useState } from 'react';
import { getAccounts, type Account } from '@/services/accountService';
import { getCategories } from '@/services/categoryService';
import type { Category, TransactionType } from '@/types/transaction';

export function useTransactionData(companyId: string) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);
    Promise.all([getAccounts(companyId), getCategories(companyId)])
      .then(([accountsData, categoriesData]) => {
        setAccounts(accountsData);
        setCategories(
          categoriesData.map((cat) => ({
            ...cat,
            type: (typeof cat.type === 'string'
              ? cat.type.toUpperCase()
              : cat.type) as TransactionType,
          })),
        );
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : 'Erro ao carregar contas ou categorias.',
        );
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  return { accounts, categories, loading, loadError };
}

