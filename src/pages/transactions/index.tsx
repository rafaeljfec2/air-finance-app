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

type MockTransaction = {
  id: string
  tipo: 'RECEITA' | 'DESPESA'
  descricao: string
  valor: number
  data: string
  categoriaId: string
  contaId: string
  observacao: string
  categoria: {
    id: string
    nome: string
    tipo: string
  }
  conta: {
    id: string
    nome: string
  }
}

// Importando o mock de dados (temporário)
const mockTransactions: MockTransaction[] = [
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
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) // Ordenar por data decrescente
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4">
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
                  className="bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </Card>          

          {/* Transactions List */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-400">Carregando transações...</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Data</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Categoria</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Descrição</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Conta</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Crédito</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Débito</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Saldo</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {transactionsWithBalance.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-300">
                              {formatDate(transaction.data)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-300">
                              {transaction.categoria.nome}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-300">
                              {transaction.descricao}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-300">
                              {transaction.conta.nome}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-right text-emerald-400">
                              {transaction.credito > 0 ? formatCurrency(transaction.credito) : '-'}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-right text-red-400">
                              {transaction.debito > 0 ? formatCurrency(transaction.debito) : '-'}
                            </td>
                            <td className={cn(
                              "py-3 px-4 text-sm font-medium text-right",
                              transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              {formatCurrency(transaction.saldo)}
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                                className="text-gray-400 hover:text-gray-300"
                              >
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
                    {transactionsWithBalance.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-gray-800/30 rounded-lg p-4 space-y-3 hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-200">{transaction.descricao}</p>
                            <p className="text-sm text-gray-400">{formatDate(transaction.data)}</p>
                          </div>
                          <div className="text-right">
                            {transaction.credito > 0 && (
                              <p className="text-sm font-medium text-emerald-400">
                                +{formatCurrency(transaction.credito)}
                              </p>
                            )}
                            {transaction.debito > 0 && (
                              <p className="text-sm font-medium text-red-400">
                                -{formatCurrency(transaction.debito)}
                              </p>
                            )}
                            <p className={cn(
                              "text-xs mt-1",
                              transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              Saldo: {formatCurrency(transaction.saldo)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="space-y-1">
                            <p>Categoria: {transaction.categoria.nome}</p>
                            <p>Conta: {transaction.conta.nome}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ViewDefault>
  )
} 