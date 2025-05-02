export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: Category;
  data: string;
  usuarioId: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: "RECEITA" | "DESPESA";
  usuarioId: string;
}

export interface Dashboard {
  saldo: number;
  receitas: number;
  despesas: number;
  transacoes: Transacao[];
}

export interface MonthlyReport {
  summary: {
    income: {
      total: number;
      categories: Array<{
        name: string;
        value: number;
      }>;
    };
    expenses: {
      total: number;
      categories: Array<{
        name: string;
        value: number;
      }>;
    };
    balance: {
      current: number;
      previous: number;
      variation: number;
    };
  };
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAutenticado: boolean;
}

export interface TransacaoFormData {
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  categoria: string;
  data: string;
}
