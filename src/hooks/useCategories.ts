import { useState } from 'react';

export type Category = {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  color: string;
  icon: string;
};

const MOCKED_CATEGORIES: Category[] = [];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(MOCKED_CATEGORIES);
  const [loading, setLoading] = useState(false);

  // Simular fetch do backend
  const fetchCategories = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setLoading(false);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setCategories((prev) => [...prev, { ...category, id: Date.now().toString() }]);
    setLoading(false);
  };

  const updateCategory = async (id: string, category: Omit<Category, 'id'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...category, id } : c)));
    setLoading(false);
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setLoading(false);
  };

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
