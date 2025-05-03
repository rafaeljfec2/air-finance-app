import { useState } from 'react';

export type Category = {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  color: string;
  icon: string;
  companyId: string;
};

const MOCKED_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Alimentação',
    type: 'despesa',
    color: '#F44336',
    icon: 'ShoppingCartIcon',
    companyId: '',
  },
  {
    id: '2',
    name: 'Transporte',
    type: 'despesa',
    color: '#1976D2',
    icon: 'WalletIcon',
    companyId: '',
  },
  {
    id: '3',
    name: 'Lazer',
    type: 'despesa',
    color: '#8A05BE',
    icon: 'GiftIcon',
    companyId: '',
  },
  {
    id: '4',
    name: 'Salário',
    type: 'receita',
    color: '#009688',
    icon: 'ArrowTrendingUpIcon',
    companyId: '',
  },
  {
    id: '5',
    name: 'Freelance',
    type: 'receita',
    color: '#FFC107',
    icon: 'TagIcon',
    companyId: '',
  },
];

export function useCategories(companyId?: string) {
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

  // Filtrar categorias pela empresa ativa, se fornecida
  const filteredCategories = companyId
    ? categories.filter((c) => c.companyId === companyId)
    : categories;

  return {
    categories: filteredCategories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
