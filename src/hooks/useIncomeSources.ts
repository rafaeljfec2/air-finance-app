import { useState } from 'react';

export type IncomeSource = {
  id: string;
  name: string;
  type: string;
  recurrence: string;
};

export const useIncomeSources = () => {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  const addIncomeSource = async (incomeSource: Omit<IncomeSource, 'id'>) => {
    const newIncomeSource = {
      ...incomeSource,
      id: Math.random().toString(36).substr(2, 9),
    };
    setIncomeSources((prev) => [...prev, newIncomeSource]);
    return newIncomeSource;
  };

  const updateIncomeSource = async (id: string, incomeSource: Omit<IncomeSource, 'id'>) => {
    setIncomeSources((prev) => prev.map((i) => (i.id === id ? { ...incomeSource, id } : i)));
  };

  const deleteIncomeSource = async (id: string) => {
    setIncomeSources((prev) => prev.filter((i) => i.id !== id));
  };

  return {
    incomeSources,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
  };
};
