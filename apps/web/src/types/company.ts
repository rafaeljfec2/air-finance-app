export interface Company {
  id: string;
  name: string;
  cnpj: string;
  documentType?: 'CPF' | 'CNPJ';
  type: 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';
  foundationDate: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  userIds: string[];
  pierreFinanceTenantId?: string;
  createdAt: string;
  updatedAt: string;
}
