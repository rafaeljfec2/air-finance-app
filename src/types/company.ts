export interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';
  foundationDate: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
