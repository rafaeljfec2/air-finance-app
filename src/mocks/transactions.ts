import { Transaction } from '@/components/transactions/TransactionGrid'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    tipo: 'DESPESA',
    descricao: 'Supermercado',
    valor: 250.50,
    data: '2024-03-15',
    categoriaId: 'cat1',
    contaId: 'conta1',
    observacao: 'Compras do mês',
    categoria: { id: 'cat1', nome: 'Alimentação', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '2',
    tipo: 'RECEITA',
    descricao: 'Salário',
    valor: 5000.00,
    data: '2024-03-10',
    categoriaId: 'cat2',
    contaId: 'conta1',
    observacao: 'Salário mensal',
    categoria: { id: 'cat2', nome: 'Salário', tipo: 'RECEITA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '3',
    tipo: 'DESPESA',
    descricao: 'Aluguel',
    valor: 1500.00,
    data: '2024-03-05',
    categoriaId: 'cat3',
    contaId: 'conta1',
    observacao: 'Aluguel do apartamento',
    categoria: { id: 'cat3', nome: 'Moradia', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '4',
    tipo: 'DESPESA',
    descricao: 'Academia',
    valor: 120.00,
    data: '2024-03-01',
    categoriaId: 'cat4',
    contaId: 'conta1',
    observacao: 'Mensalidade',
    categoria: { id: 'cat4', nome: 'Saúde', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '5',
    tipo: 'RECEITA',
    descricao: 'Freelance',
    valor: 800.00,
    data: '2024-03-20',
    categoriaId: 'cat5',
    contaId: 'conta1',
    observacao: 'Projeto de desenvolvimento',
    categoria: { id: 'cat5', nome: 'Freelance', tipo: 'RECEITA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '6',
    tipo: 'DESPESA',
    descricao: 'Internet',
    valor: 99.90,
    data: '2024-03-15',
    categoriaId: 'cat6',
    contaId: 'conta1',
    observacao: 'Mensalidade',
    categoria: { id: 'cat6', nome: 'Serviços', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '7',
    tipo: 'DESPESA',
    descricao: 'Combustível',
    valor: 200.00,
    data: '2024-03-18',
    categoriaId: 'cat7',
    contaId: 'conta1',
    observacao: 'Posto Shell',
    categoria: { id: 'cat7', nome: 'Transporte', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '8',
    tipo: 'RECEITA',
    descricao: 'Investimentos',
    valor: 150.00,
    data: '2024-03-25',
    categoriaId: 'cat8',
    contaId: 'conta2',
    observacao: 'Dividendos',
    categoria: { id: 'cat8', nome: 'Investimentos', tipo: 'RECEITA' },
    conta: { id: 'conta2', nome: 'Poupança' }
  },
  {
    id: '9',
    tipo: 'DESPESA',
    descricao: 'Energia Elétrica',
    valor: 180.00,
    data: '2024-03-12',
    categoriaId: 'cat9',
    contaId: 'conta1',
    observacao: 'Conta de luz',
    categoria: { id: 'cat9', nome: 'Serviços', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '10',
    tipo: 'DESPESA',
    descricao: 'Água',
    valor: 85.00,
    data: '2024-03-14',
    categoriaId: 'cat9',
    contaId: 'conta1',
    observacao: 'Conta de água',
    categoria: { id: 'cat9', nome: 'Serviços', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  },
  {
    id: '11',
    tipo: 'RECEITA',
    descricao: 'Venda Item Usado',
    valor: 350.00,
    data: '2024-03-22',
    categoriaId: 'cat10',
    contaId: 'conta3',
    observacao: 'Venda pelo Marketplace',
    categoria: { id: 'cat10', nome: 'Outras Receitas', tipo: 'RECEITA' },
    conta: { id: 'conta3', nome: 'Investimentos' }
  },
  {
    id: '12',
    tipo: 'DESPESA',
    descricao: 'Presente Aniversário',
    valor: 150.00,
    data: '2024-03-19',
    categoriaId: 'cat11',
    contaId: 'conta1',
    observacao: 'Presente para amigo',
    categoria: { id: 'cat11', nome: 'Lazer', tipo: 'DESPESA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  }
]

export const mockCategories = [
  { id: 'cat1', nome: 'Alimentação', tipo: 'DESPESA' },
  { id: 'cat2', nome: 'Salário', tipo: 'RECEITA' },
  { id: 'cat3', nome: 'Moradia', tipo: 'DESPESA' },
  { id: 'cat4', nome: 'Saúde', tipo: 'DESPESA' },
  { id: 'cat5', nome: 'Freelance', tipo: 'RECEITA' },
  { id: 'cat6', nome: 'Serviços', tipo: 'DESPESA' },
  { id: 'cat7', nome: 'Transporte', tipo: 'DESPESA' },
  { id: 'cat8', nome: 'Investimentos', tipo: 'RECEITA' },
  { id: 'cat9', nome: 'Serviços', tipo: 'DESPESA' },
  { id: 'cat10', nome: 'Outras Receitas', tipo: 'RECEITA' },
  { id: 'cat11', nome: 'Lazer', tipo: 'DESPESA' }
]

export const mockAccounts = [
  { id: 'conta1', nome: 'Conta Corrente' },
  { id: 'conta2', nome: 'Poupança' },
  { id: 'conta3', nome: 'Investimentos' }
] 