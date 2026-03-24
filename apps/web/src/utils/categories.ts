import { Category } from '@/types';

const categories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    type: 'INCOME',
    color: '#10B981',
    icon: '💼',
  },
  {
    id: '2',
    name: 'Freelance',
    type: 'INCOME',
    color: '#3B82F6',
    icon: '💻',
  },
  {
    id: '3',
    name: 'Investments',
    type: 'INCOME',
    color: '#8B5CF6',
    icon: '📈',
  },
  {
    id: '4',
    name: 'Housing',
    type: 'EXPENSE',
    color: '#EF4444',
    icon: '🏠',
  },
  {
    id: '5',
    name: 'Food',
    type: 'EXPENSE',
    color: '#F59E0B',
    icon: '🍽️',
  },
  {
    id: '6',
    name: 'Transport',
    type: 'EXPENSE',
    color: '#6366F1',
    icon: '🚗',
  },
  {
    id: '7',
    name: 'Leisure',
    type: 'EXPENSE',
    color: '#EC4899',
    icon: '🎮',
  },
];

export function getCategoriesByType(type: 'INCOME' | 'EXPENSE'): Category[] {
  return categories.filter((category) => category.type === type);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || '#000000';
}

export function getCategoryIcon(id: string): string {
  return getCategoryById(id)?.icon || '💰';
}
