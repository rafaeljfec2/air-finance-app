import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  ChevronRight,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionGrid, Transaction } from '@/components/transactions/TransactionGrid'
import { mockTransactions } from '@/mocks/transactions'

export function Transactions() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Simular loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const filteredTransactions = mockTransactions
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .filter((transaction) => {
      const matchesSearch = transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || transaction.tipo === selectedType
      return matchesSearch && matchesType
    })

  // Calcular saldo acumulado para cada transação
  let saldoAcumulado = 0
  const transactionsWithBalance = filteredTransactions.map(transaction => {
    const credito = transaction.tipo === 'RECEITA' ? transaction.valor : 0
    const debito = transaction.tipo === 'DESPESA' ? transaction.valor : 0
    saldoAcumulado += credito - debito
    return {
      ...transaction,
      credito,
      debito,
      saldo: saldoAcumulado
    }
  })

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Transações</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="current">Mês atual</option>
                    <option value="last">Mês anterior</option>
                    <option value="custom">Personalizado</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="RECEITA">Receitas</option>
                    <option value="DESPESA">Despesas</option>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 1000)
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Pesquisar
                </Button>
                <Button
                  variant="outline"
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </Card>

          {/* Transactions Grid */}
          <TransactionGrid
            transactions={transactionsWithBalance}
            isLoading={isLoading}
            showActions={true}
            onActionClick={(transaction) => navigate(`/transactions/edit/${transaction.id}`)}
          />
        </div>
      </div>
    </ViewDefault>
  )
} 