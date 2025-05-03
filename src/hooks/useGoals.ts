import { useState } from 'react';

export type Goal = {
  id: string;
  name: string;
  targetValue: number;
  dueDate: string; // ISO date string
  categoryId: string;
};

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = async (id: string, goal: Omit<Goal, 'id'>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...goal, id } : g)));
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
};
