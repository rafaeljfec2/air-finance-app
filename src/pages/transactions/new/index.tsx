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
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setTransactionType(e.target.value as 'RECEITA' | 'DESPESA')
                    handleChange(e)
                  }}
                >
                  <option value="DESPESA">Despesa</option>
                  <option value="RECEITA">Receita</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <Input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <Input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <Select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  required
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
                <label className="block text-sm font-medium mb-1">Conta</label>
                <Select
                  name="contaId"
                  value={formData.contaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma conta</option>
                  {accounts.map((account: Account) => (
                    <option key={account.id} value={account.id}>
                      {account.nome}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Observação</label>
                <Textarea
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/transactions')}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Card>
      </div>
    </ViewDefault>
  )
} 