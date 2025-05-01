import { TransactionType } from '@/types/transaction';

export interface Category {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  tipos: TransactionType[];
}

export const CATEGORIES: Category[] = [
  { id: '1', nome: 'Alimentação', icone: '🍽️', cor: '#60A5FA', tipos: ['DESPESA'] },
  { id: '2', nome: 'Transporte', icone: '🚗', cor: '#F87171', tipos: ['DESPESA'] },
  { id: '3', nome: 'Moradia', icone: '🏠', cor: '#34D399', tipos: ['DESPESA'] },
  { id: '4', nome: 'Saúde', icone: '⚕️', cor: '#A78BFA', tipos: ['DESPESA'] },
  { id: '5', nome: 'Educação', icone: '📚', cor: '#FBBF24', tipos: ['DESPESA'] },
  { id: '6', nome: 'Lazer', icone: '🎮', cor: '#EC4899', tipos: ['DESPESA'] },
  { id: '7', nome: 'Salário', icone: '💰', cor: '#34D399', tipos: ['RECEITA'] },
  { id: '8', nome: 'Investimentos', icone: '📈', cor: '#8B5CF6', tipos: ['RECEITA', 'DESPESA'] },
];

export const getCategoriesByType = (tipo: TransactionType): Category[] => {
  return CATEGORIES.filter(category => category.tipos.includes(tipo));
};
