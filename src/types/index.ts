export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  categoria: string;
  data: string;
  usuarioId: string;
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
