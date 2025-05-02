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
    contaId: 'conta1',
    observacao: 'Dividendos',
    categoria: { id: 'cat8', nome: 'Investimentos', tipo: 'RECEITA' },
    conta: { id: 'conta1', nome: 'Conta Corrente' }
  }
]

export function NewTransaction() {
  const navigate = useNavigate()
  const { addTransaction, categories, accounts } = useTransactionStore()
  const [transactionType, setTransactionType] = useState<'RECEITA' | 'DESPESA'>('DESPESA')
  const [formData, setFormData] = useState<TransactionInput>({
    tipo: 'DESPESA',
    descricao: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    categoriaId: '',
    contaId: '',
    observacao: '',
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
      [name]: name === 'valor' ? parseFloat(value) : value,
    }))
  }

  const filteredCategories = categories.filter((category: Category) => category.tipo === transactionType)

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
                      setTransactionType('DESPESA')
                      setFormData(prev => ({ ...prev, tipo: 'DESPESA' }))
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all',
                      transactionType === 'DESPESA'
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
                      setTransactionType('RECEITA')
                      setFormData(prev => ({ ...prev, tipo: 'RECEITA' }))
                    }}
                    className={cn(
                      'p-3 rounded-lg border flex items-center justify-center gap-2 transition-all',
                      transactionType === 'RECEITA'
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
                      name="valor"
                      value={formData.valor}
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
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Categoria
                  </label>
                  <Select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  >
                    <option value="">Selecione uma categoria</option>
                    {filteredCategories.map((category: Category) => (
                      <option key={category.id} value={category.id}>
                        {category.nome}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Conta
                  </label>
                  <Select
                    name="contaId"
                    value={formData.contaId}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                  >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((account: Account) => (
                      <option key={account.id} value={account.id}>
                        {account.nome}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Descrição
                  </label>
                  <Input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-brand-arrow dark:focus:border-brand-leaf h-10"
                    placeholder="Digite uma descrição clara para a transação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
                    Observações
                  </label>
                  <Textarea
                    name="observacao"
                    value={formData.observacao}
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
                      transactionType === 'DESPESA'
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