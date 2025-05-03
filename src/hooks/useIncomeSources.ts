import { useState, useEffect } from 'react';
import { IncomeSource } from '@/types/incomeSource';
import { useCompanyContext } from '@/contexts/companyContext';

export function useIncomeSources() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    loadIncomeSources();
  }, [companyId]);

  const loadIncomeSources = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockIncomeSources: IncomeSource[] = [
        {
          id: '1',
          name: 'Salário',
          description: 'Salário mensal',
          type: 'fixed',
          amount: 5000,
          frequency: 'monthly',
          startDate: '2024-01-01',
          status: 'active',
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Freelance',
          description: 'Trabalhos freelancer',
          type: 'variable',
          amount: 2000,
          frequency: 'monthly',
          startDate: '2024-01-01',
          status: 'active',
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setIncomeSources(mockIncomeSources.filter((source) => source.companyId === companyId));
    } catch (err) {
      setError('Erro ao carregar fontes de receita');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addIncomeSource = async (source: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSource: IncomeSource = {
        ...source,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIncomeSources((prev) => [...prev, newSource]);
      return newSource;
    } catch (err) {
      setError('Erro ao adicionar fonte de receita');
      throw err;
    }
  };

  const updateIncomeSource = async (id: string, source: Partial<IncomeSource>) => {
    try {
      setIncomeSources((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...source, updatedAt: new Date().toISOString() } : s,
        ),
      );
    } catch (err) {
      setError('Erro ao atualizar fonte de receita');
      throw err;
    }
  };

  const deleteIncomeSource = async (id: string) => {
    try {
      setIncomeSources((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError('Erro ao excluir fonte de receita');
      throw err;
    }
  };

  return {
    incomeSources,
    loading,
    error,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    loadIncomeSources,
  };
}
