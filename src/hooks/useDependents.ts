import { useState } from 'react';

export type Dependent = {
  id: string;
  name: string;
  relation: string;
  color: string;
  icon: string;
};

export const useDependents = () => {
  const [dependents, setDependents] = useState<Dependent[]>([]);

  const addDependent = async (dependent: Omit<Dependent, 'id'>) => {
    const newDependent = {
      ...dependent,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDependents((prev) => [...prev, newDependent]);
    return newDependent;
  };

  const updateDependent = async (id: string, dependent: Omit<Dependent, 'id'>) => {
    setDependents((prev) => prev.map((d) => (d.id === id ? { ...dependent, id } : d)));
  };

  const deleteDependent = async (id: string) => {
    setDependents((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    dependents,
    addDependent,
    updateDependent,
    deleteDependent,
  };
};
