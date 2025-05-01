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
import { ArrowDownCircle, ArrowUpCircle, Receipt, ChevronLeft } from 'lucide-react'

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
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
        {/* Header Fixo */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/transactions')}
                  className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-400" />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-100">Novo Lançamento</h1>
                  <p className="text-xs text-gray-400">Preencha os dados da transação</p>
                </div>
              </div>
              <Button 
                type="submit"
                form="transaction-form"
                className={cn(
                  'transition-all text-sm px-4 py-2 h-9',
                  transactionType === 'DESPESA'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                )}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <form id="transaction-form" onSubmit={handleSubmit} className="divide-y divide-gray-700/50">
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
                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
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
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
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
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Valor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">R$</span>
                    </div>
                    <Input
                      type="number"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                      className="pl-10 bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500 h-10"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Data
                  </label>
                  <Input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500 h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Categoria
                  </label>
                  <Select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500 h-10"
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
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Conta
                  </label>
                  <Select
                    name="contaId"
                    value={formData.contaId}
                    onChange={handleChange}
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500 h-10"
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
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Descrição
                  </label>
                  <Input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500 h-10"
                    placeholder="Digite uma descrição clara para a transação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Observações
                  </label>
                  <Textarea
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    rows={3}
                    className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                    placeholder="Adicione informações complementares sobre a transação (opcional)"
                  />
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ViewDefault>
  )
} 