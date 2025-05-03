import { useState, useEffect } from 'react';
import { Goal } from '@/types/goal';
import { useCompanyContext } from '@/contexts/companyContext';

export function useGoals() {
  const { companyId } = useCompanyContext();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    loadGoals();
  }, [companyId]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Viagem para Europa',
          description: 'Economizar para viagem de 15 dias',
          targetAmount: 15000,
          currentAmount: 5000,
          deadline: '2024-12-31',
          status: 'active',
          companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setGoals(mockGoals.filter((goal) => goal.companyId === companyId));
    } catch (err) {
      setError('Erro ao carregar metas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGoals((prev) => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      setError('Erro ao adicionar meta');
      throw err;
    }
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    try {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...goal, updatedAt: new Date().toISOString() } : g)),
      );
    } catch (err) {
      setError('Erro ao atualizar meta');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError('Erro ao excluir meta');
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    loadGoals,
  };
}
