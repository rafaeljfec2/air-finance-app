import { TransactionType } from '@/types/transaction';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  types: TransactionType[];
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', icon: '🍽️', color: '#60A5FA', types: ['EXPENSE'] },
  { id: '2', name: 'Transporte', icon: '🚗', color: '#F87171', types: ['EXPENSE'] },
  { id: '3', name: 'Moradia', icon: '🏠', color: '#34D399', types: ['EXPENSE'] },
  { id: '4', name: 'Saúde', icon: '⚕️', color: '#A78BFA', types: ['EXPENSE'] },
  { id: '5', name: 'Educação', icon: '📚', color: '#FBBF24', types: ['EXPENSE'] },
  { id: '6', name: 'Lazer', icon: '🎮', color: '#EC4899', types: ['EXPENSE'] },
  { id: '7', name: 'Salário', icon: '💰', color: '#34D399', types: ['INCOME'] },
  { id: '8', name: 'Investimentos', icon: '📈', color: '#8B5CF6', types: ['INCOME', 'EXPENSE'] },
];

export const getCategoriesByType = (type: TransactionType): Category[] => {
  return CATEGORIES.filter((category) => category.types.includes(type));
};
