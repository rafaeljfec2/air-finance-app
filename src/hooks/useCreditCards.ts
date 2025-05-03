import { useState } from 'react';

export type CreditCard = {
  id: string;
  name: string;
  bank: string;
  limit: number;
  dueDate: number; // Dia do vencimento (1-31)
  color: string;
  icon: string;
};

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  const addCreditCard = async (creditCard: Omit<CreditCard, 'id'>) => {
    const newCreditCard = {
      ...creditCard,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCreditCards((prev) => [...prev, newCreditCard]);
    return newCreditCard;
  };

  const updateCreditCard = async (id: string, creditCard: Omit<CreditCard, 'id'>) => {
    setCreditCards((prev) => prev.map((c) => (c.id === id ? { ...creditCard, id } : c)));
  };

  const deleteCreditCard = async (id: string) => {
    setCreditCards((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    creditCards,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
  };
};
