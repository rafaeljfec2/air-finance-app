export interface Category {
  id: string;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  icone?: string;
}

export interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: Category;
  observacao?: string;
  anexos?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
