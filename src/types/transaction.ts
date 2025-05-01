export interface Category {
  id: string;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  icone?: string;
}

export interface Transaction {
  id: string;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
  contaId: string;
  observacao?: string;
  anexos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  nome: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
