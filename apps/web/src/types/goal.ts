export type Goal = {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  categoryId?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};
