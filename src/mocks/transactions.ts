import { Transaction } from '@/components/transactions/TransactionGrid'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'EXPENSE',
    description: 'Supermercado',
    amount: 250.50,
    date: '2024-03-15',
    categoryId: 'cat1',
    accountId: 'conta1',
    note: 'Compras do mês',
    category: { id: 'cat1', name: 'Alimentação', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '2',
    type: 'INCOME',
    description: 'Salário',
    amount: 5000.00,
    date: '2024-03-10',
    categoryId: 'cat2',
    accountId: 'conta1',
    note: 'Salário mensal',
    category: { id: 'cat2', name: 'Salário', type: 'INCOME' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '3',
    type: 'EXPENSE',
    description: 'Aluguel',
    amount: 1500.00,
    date: '2024-03-05',
    categoryId: 'cat3',
    accountId: 'conta1',
    note: 'Aluguel do apartamento',
    category: { id: 'cat3', name: 'Moradia', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '4',
    type: 'EXPENSE',
    description: 'Academia',
    amount: 120.00,
    date: '2024-03-01',
    categoryId: 'cat4',
    accountId: 'conta1',
    note: 'Mensalidade',
    category: { id: 'cat4', name: 'Saúde', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '5',
    type: 'INCOME',
    description: 'Freelance',
    amount: 800.00,
    date: '2024-03-20',
    categoryId: 'cat5',
    accountId: 'conta1',
    note: 'Projeto de desenvolvimento',
    category: { id: 'cat5', name: 'Freelance', type: 'INCOME' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '6',
    type: 'EXPENSE',
    description: 'Internet',
    amount: 99.90,
    date: '2024-03-15',
    categoryId: 'cat6',
    accountId: 'conta1',
    note: 'Mensalidade',
    category: { id: 'cat6', name: 'Serviços', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '7',
    type: 'EXPENSE',
    description: 'Combustível',
    amount: 200.00,
    date: '2024-03-18',
    categoryId: 'cat7',
    accountId: 'conta1',
    note: 'Posto Shell',
    category: { id: 'cat7', name: 'Transporte', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '8',
    type: 'INCOME',
    description: 'Investimentos',
    amount: 150.00,
    date: '2024-03-25',
    categoryId: 'cat8',
    accountId: 'conta2',
    note: 'Dividendos',
    category: { id: 'cat8', name: 'Investimentos', type: 'INCOME' },
    account: { id: 'conta2', name: 'Poupança' }
  },
  {
    id: '9',
    type: 'EXPENSE',
    description: 'Energia Elétrica',
    amount: 180.00,
    date: '2024-03-12',
    categoryId: 'cat9',
    accountId: 'conta1',
    note: 'Conta de luz',
    category: { id: 'cat9', name: 'Serviços', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '10',
    type: 'EXPENSE',
    description: 'Água',
    amount: 85.00,
    date: '2024-03-14',
    categoryId: 'cat9',
    accountId: 'conta1',
    note: 'Conta de água',
    category: { id: 'cat9', name: 'Serviços', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  },
  {
    id: '11',
    type: 'INCOME',
    description: 'Venda Item Usado',
    amount: 350.00,
    date: '2024-03-22',
    categoryId: 'cat10',
    accountId: 'conta3',
    note: 'Venda pelo Marketplace',
    category: { id: 'cat10', name: 'Outras Receitas', type: 'INCOME' },
    account: { id: 'conta3', name: 'Investimentos' }
  },
  {
    id: '12',
    type: 'EXPENSE',
    description: 'Presente Aniversário',
    amount: 150.00,
    date: '2024-03-19',
    categoryId: 'cat11',
    accountId: 'conta1',
    note: 'Presente para amigo',
    category: { id: 'cat11', name: 'Lazer', type: 'EXPENSE' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  }
]

export const mockCategories = [
  { id: 'cat1', name: 'Alimentação', type: 'EXPENSE' },
  { id: 'cat2', name: 'Salário', type: 'INCOME' },
  { id: 'cat3', name: 'Moradia', type: 'EXPENSE' },
  { id: 'cat4', name: 'Saúde', type: 'EXPENSE' },
  { id: 'cat5', name: 'Freelance', type: 'INCOME' },
  { id: 'cat6', name: 'Serviços', type: 'EXPENSE' },
  { id: 'cat7', name: 'Transporte', type: 'EXPENSE' },
  { id: 'cat8', name: 'Investimentos', type: 'INCOME' },
  { id: 'cat9', name: 'Serviços', type: 'EXPENSE' },
  { id: 'cat10', name: 'Outras Receitas', type: 'INCOME' },
  { id: 'cat11', name: 'Lazer', type: 'EXPENSE' }
]

export const mockAccounts = [
  { id: 'conta1', name: 'Conta Corrente' },
  { id: 'conta2', name: 'Poupança' },
  { id: 'conta3', name: 'Investimentos' }
] 