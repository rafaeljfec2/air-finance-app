import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactionStore } from '@/stores/transaction'
import { TransactionInput, Category, Account } from '@/types/transaction'
import { ViewDefault } from '@/layouts/ViewDefault'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft } from 'lucide-react'

// Mock data para demonstração
const mockTransactions = [
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
    accountId: 'conta1',
    note: 'Dividendos',
    category: { id: 'cat8', name: 'Investimentos', type: 'INCOME' },
    account: { id: 'conta1', name: 'Conta Corrente' }
  }
]

export function NewTransaction() {
  const navigate = useNavigate()
  const { addTransaction, categories, accounts } = useTransactionStore()
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [formData, setFormData] = useState<TransactionInput>({
    type: 'EXPENSE',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    note: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTransaction(formData)
    navigate('/transactions')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }))
  }

  const filteredCategories = categories.filter((category: Category) => category.type === transactionType)

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        {/* Header Fixo */}
        <div className="sticky top-0 z-10 bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/transactions')}
                className="p-2 -ml-2 hover:bg-card dark:hover:bg-card-dark rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-text dark:text-text-dark" />
              </button>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-text dark:text-text-dark">Novo Lançamento</h1>
                <p className="text-sm text-text/60 dark:text-text-dark/60">Preencha os dados da transação</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm w-full sm:max-w-[60%] sm:mx-auto">
            <form id="transaction-form" onSubmit={handleSubmit} className="divide-y divide-border dark:divide-border-dark">
              {/* Tipo de Transação */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('EXPENSE')
                      setFormData(prev => ({ ...prev, type: 'EXPENSE' }))
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all',
                      transactionType === 'EXPENSE'
                        ? 'bg-red-500/10 border-red-500/50 text-red-500 dark:text-red-400'
                        : 'border-border dark:border-border-dark text-text/60 dark:text-text-dark/60 hover:border-text/30 dark:hover:border-text-dark/30'
                    )}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                    <span className="text-sm">Despesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('INCOME')
                      setFormData(prev => ({ ...prev, type: 'INCOME' }))
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all',
                      transactionType === 'INCOME'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 dark:text-emerald-400'
                        : 'border-border dark:border-border-dark text-text/60 dark:text-text-dark/60 hover:border-text/30 dark:hover:border-text-dark/30'
                    )}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                    <span className="text-sm">Receita</span>
                  </button>
                </div>
              </div>

              {/* Campos Principais */}
              <div className="space-y-4 p-4 sm:p-6">
                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Valor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-text/60 dark:text-text-dark/60">R$</span>
                    </div>
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                      className="pl-10 bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Data
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Category
                  </label>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  >
                    <option value="">Selecione uma categoria</option>
                    {filteredCategories.map((category: Category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Account
                  </label>
                  <Select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((account: Account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Description
                  </label>
                  <Input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                    placeholder="Digite uma descrição clara para a transação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Notes
                  </label>
                  <Textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={3}
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf"
                    placeholder="Adicione informações complementares sobre a transação (opcional)"
                  />
                </div>

                {/* Botão Salvar no final do formulário */}
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit"
                    className={cn(
                      'transition-all text-sm h-11 px-8 text-white',
                      transactionType === 'EXPENSE'
                        ? 'bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500'
                        : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500/90 dark:hover:bg-emerald-500'
                    )}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  )
} 