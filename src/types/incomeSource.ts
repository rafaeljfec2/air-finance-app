export type IncomeSource = {
  id: string;
  name: string;
  description?: string;
  type: 'fixed' | 'variable' | 'passive';
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive';
  companyId: string;
  createdAt: string;
  updatedAt: string;
};
