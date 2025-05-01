import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactionStore } from '@/stores/transaction'
import { Transaction } from '@/types/transaction'
import { ViewDefault } from '@/layouts/ViewDefault'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  Receipt,
  Search,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Transactions() {
  const navigate = useNavigate()
  const { transactions } = useTransactionStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch = transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || transaction.tipo === selectedType
    // Implementar filtro por período quando necessário
    return matchesSearch && matchesType
  })

  const totalReceitas = filteredTransactions
    .filter(t => t.tipo === 'RECEITA')
    .reduce((sum, t) => sum + t.valor, 0)

  const totalDespesas = filteredTransactions
    .filter(t => t.tipo === 'DESPESA')
    .reduce((sum, t) => sum + t.valor, 0)

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-gray-100">Transações</h1>
              </div>
              <p className="text-sm text-gray-400">
                Gerencie todas as suas transações financeiras
              </p>
            </div>
            <Button
              onClick={() => navigate('/transactions/new')}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Transação
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="current">Mês atual</option>
                    <option value="last">Mês anterior</option>
                    <option value="custom">Personalizado</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-gray-700/50 border-gray-600 text-gray-100 focus:border-gray-500"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="RECEITA">Receitas</option>
                    <option value="DESPESA">Despesas</option>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">Total de Receitas</h3>
                  <ArrowUpCircle className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-green-400">
                  {formatCurrency(totalReceitas)}
                </p>
              </div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">Total de Despesas</h3>
                  <ArrowDownCircle className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-red-400">
                  {formatCurrency(totalDespesas)}
                </p>
              </div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">Saldo do Período</h3>
                  <div className={cn(
                    "h-5 w-5",
                    totalReceitas - totalDespesas >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {totalReceitas - totalDespesas >= 0 ? <ArrowUpCircle /> : <ArrowDownCircle />}
                  </div>
                </div>
                <p className={cn(
                  "text-xl sm:text-2xl font-semibold",
                  totalReceitas - totalDespesas >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {formatCurrency(totalReceitas - totalDespesas)}
                </p>
              </div>
            </Card>
          </div>

          {/* Transactions List */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-4 sm:p-6">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Descrição</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Categoria</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Conta</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Valor</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredTransactions.map((transaction: Transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {formatDate(transaction.data)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {transaction.descricao}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {transaction.categoriaId}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {transaction.contaId}
                        </td>
                        <td className={cn(
                          "py-3 px-4 text-sm font-medium text-right",
                          transaction.tipo === 'RECEITA' ? "text-green-400" : "text-red-400"
                        )}>
                          {formatCurrency(transaction.valor)}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-gray-400 hover:text-gray-300">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map((transaction: Transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-800/30 rounded-lg p-4 space-y-3 hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-200">{transaction.descricao}</p>
                        <p className="text-sm text-gray-400">{formatDate(transaction.data)}</p>
                      </div>
                      <p className={cn(
                        "text-base font-medium",
                        transaction.tipo === 'RECEITA' ? "text-green-400" : "text-red-400"
                      )}>
                        {formatCurrency(transaction.valor)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="space-y-1">
                        <p>Categoria: {transaction.categoriaId}</p>
                        <p>Conta: {transaction.contaId}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ViewDefault>
  )
} 