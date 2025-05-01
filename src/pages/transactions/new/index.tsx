import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactionStore } from '@/stores/transaction'
import { TransactionInput, Category, Account } from '@/types/transaction'
import ViewDefault from '@/components/ViewDefault'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Nova Transação</h1>
              <p className="mt-1 text-sm text-gray-400">
                Preencha os dados abaixo para registrar uma nova transação
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/transactions')}
              className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              Voltar para Transações
            </Button>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-700/50">
              {/* Tipo de Transação */}
              <div className="p-8">
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tipo de Transação
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType('DESPESA')
                        setFormData(prev => ({ ...prev, tipo: 'DESPESA' }))
                      }}
                      className={cn(
                        'p-4 rounded-lg border flex items-center justify-center gap-3 transition-all hover:scale-[1.02]',
                        transactionType === 'DESPESA'
                          ? 'bg-red-500/10 border-red-500/50 text-red-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      )}
                    >
                      <ArrowDownCircle className="h-5 w-5" />
                      <span>Despesa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType('RECEITA')
                        setFormData(prev => ({ ...prev, tipo: 'RECEITA' }))
                      }}
                      className={cn(
                        'p-4 rounded-lg border flex items-center justify-center gap-3 transition-all hover:scale-[1.02]',
                        transactionType === 'RECEITA'
                          ? 'bg-green-500/10 border-green-500/50 text-green-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      )}
                    >
                      <ArrowUpCircle className="h-5 w-5" />
                      <span>Receita</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className="pl-10 bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data
                      </label>
                      <Input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        required
                        className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoria
                      </label>
                      <Select
                        name="categoriaId"
                        value={formData.categoriaId}
                        onChange={handleChange}
                        required
                        className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Conta
                      </label>
                      <Select
                        name="contaId"
                        value={formData.contaId}
                        onChange={handleChange}
                        required
                        className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                      >
                        <option value="">Selecione uma conta</option>
                        {accounts.map((account: Account) => (
                          <option key={account.id} value={account.id}>
                            {account.nome}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição
                    </label>
                    <Input
                      type="text"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      required
                      className="bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                      placeholder="Digite uma descrição clara para a transação"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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

              {/* Ações */}
              <div className="p-8 bg-gray-800/80">
                <div className="max-w-2xl mx-auto flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/transactions')}
                    className="mt-3 sm:mt-0 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className={cn(
                      'transition-all hover:scale-[1.02]',
                      transactionType === 'DESPESA'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    )}
                  >
                    Salvar {transactionType === 'DESPESA' ? 'Despesa' : 'Receita'}
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