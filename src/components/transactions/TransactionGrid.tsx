import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { MoreHorizontal, ChevronRight, Loader2, ChevronLeft, ChevronRightIcon, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'

type SortField = 'hora' | 'categoria' | 'descricao' | 'conta' | 'valor' | 'saldo'
type SortDirection = 'asc' | 'desc'

export type Transaction = {
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
  credito?: number
  debito?: number
  saldo?: number
}

interface TransactionGridProps {
  transactions: Transaction[]
  isLoading?: boolean
  showActions?: boolean
  onActionClick?: (transaction: Transaction) => void
  className?: string
}

export function TransactionGrid({
  transactions,
  isLoading = false,
  showActions = true,
  onActionClick,
  className
}: TransactionGridProps) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [itemsPerPageSelected, setItemsPerPageSelected] = useState(itemsPerPage)
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'hora',
    direction: 'desc'
  })

  // Função para ordenar transações
  const sortTransactions = (transactions: Transaction[]) => {
    return [...transactions].sort((a, b) => {
      switch (sortConfig.field) {
        case 'hora':
          return sortConfig.direction === 'asc'
            ? new Date(a.data).getTime() - new Date(b.data).getTime()
            : new Date(b.data).getTime() - new Date(a.data).getTime()
        case 'categoria':
          return sortConfig.direction === 'asc'
            ? a.categoria.nome.localeCompare(b.categoria.nome)
            : b.categoria.nome.localeCompare(a.categoria.nome)
        case 'descricao':
          return sortConfig.direction === 'asc'
            ? a.descricao.localeCompare(b.descricao)
            : b.descricao.localeCompare(a.descricao)
        case 'conta':
          return sortConfig.direction === 'asc'
            ? a.conta.nome.localeCompare(b.conta.nome)
            : b.conta.nome.localeCompare(a.conta.nome)
        case 'valor':
          return sortConfig.direction === 'asc'
            ? a.valor - b.valor
            : b.valor - a.valor
        case 'saldo':
          return sortConfig.direction === 'asc'
            ? (a.saldo || 0) - (b.saldo || 0)
            : (b.saldo || 0) - (a.saldo || 0)
        default:
          return 0
      }
    })
  }

  // Função para alternar ordenação
  const toggleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Calcular saldo acumulado para cada transação
  let saldoAcumulado = 0
  const transactionsWithBalance = transactions.map(transaction => {
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

  // Agrupar transações por dia
  const groupedTransactions = transactionsWithBalance.reduce((acc, transaction) => {
    const date = format(new Date(transaction.data), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = {
        transactions: [],
        totalCredito: 0,
        totalDebito: 0,
        saldoFinal: 0
      }
    }
    // Aplicar ordenação nas transações do grupo
    const sortedTransactions = sortTransactions([...acc[date].transactions, transaction]) as typeof transactionsWithBalance
    acc[date].transactions = sortedTransactions
    acc[date].totalCredito += transaction.credito || 0
    acc[date].totalDebito += transaction.debito || 0
    acc[date].saldoFinal = transaction.saldo || 0
    return acc
  }, {} as Record<string, {
    transactions: typeof transactionsWithBalance
    totalCredito: number
    totalDebito: number
    saldoFinal: number
  }>)

  // Lógica de paginação
  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }, [groupedTransactions])

  const totalPages = Math.ceil(sortedDates.length / itemsPerPageSelected)
  const startIndex = (currentPage - 1) * itemsPerPageSelected
  const endIndex = startIndex + itemsPerPageSelected
  const currentDates = sortedDates.slice(startIndex, endIndex)

  const [visibleItems, setVisibleItems] = useState<number>(10)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Função para carregar mais itens quando o usuário rolar até o final
  const loadMore = useCallback(() => {
    setVisibleItems(prev => Math.min(prev + 10, currentDates.length))
  }, [currentDates.length])

  // Configurar o IntersectionObserver para detectar quando o usuário chega ao final da lista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPageSelected(value)
    setCurrentPage(1)
  }

  const handleActionClick = (transaction: Transaction) => {
    if (onActionClick) {
      onActionClick(transaction)
    } else {
      navigate(`/transactions/edit/${transaction.id}`)
    }
  }

  // Componente de cabeçalho ordenável
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      onClick={() => toggleSort(field)}
      className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors group"
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-opacity",
          sortConfig.field === field ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )} />
      </div>
    </th>
  )

  return (
    <Card className={cn("bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm", className)}>
      <div className="p-3 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando transações...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              {currentDates.slice(0, visibleItems).map(date => {
                const group = groupedTransactions[date]
                return (
                  <div key={date} className="mb-4 bg-background/50 dark:bg-background-dark/50 rounded-lg overflow-hidden">
                    {/* Cabeçalho do Grupo */}
                    <div className="bg-background dark:bg-background-dark border-b border-border dark:border-border-dark py-2 px-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-text dark:text-text-dark">
                            {format(new Date(date), "EEEE", { locale: ptBR })}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Movimentação do dia</p>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Entradas</p>
                              <p className="text-sm font-medium text-emerald-400">
                                {formatCurrency(group.totalCredito)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saídas</p>
                              <p className="text-sm font-medium text-red-400">
                                {formatCurrency(group.totalDebito)}
                              </p>
                            </div>
                            <div className="pl-3 border-l border-border dark:border-border-dark">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saldo do dia</p>
                              <p className={cn(
                                "text-sm font-semibold",
                                group.saldoFinal >= 0 ? "text-emerald-400" : "text-red-400"
                              )}>
                                {formatCurrency(group.saldoFinal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabela de Transações */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-background/30 dark:bg-background-dark/30">
                            <SortableHeader field="hora">Hora</SortableHeader>
                            <SortableHeader field="categoria">Categoria</SortableHeader>
                            <SortableHeader field="descricao">Descrição</SortableHeader>
                            <SortableHeader field="conta">Conta</SortableHeader>
                            <SortableHeader field="valor">Valor</SortableHeader>
                            <SortableHeader field="saldo">Saldo</SortableHeader>
                            {showActions && <th className="w-10"></th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                          {group.transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="hover:bg-background/70 dark:hover:bg-background-dark/70 transition-colors"
                            >
                              <td className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(transaction.data), 'HH:mm')}
                              </td>
                              <td className="py-2 px-4 text-xs text-text dark:text-text-dark">
                                {transaction.categoria.nome}
                              </td>
                              <td className="py-2 px-4 text-xs font-medium text-text dark:text-text-dark">
                                {transaction.descricao}
                              </td>
                              <td className="py-2 px-4 text-xs text-text dark:text-text-dark">
                                {transaction.conta.nome}
                              </td>
                              <td className={cn(
                                "py-2 px-4 text-xs font-medium text-right",
                                transaction.tipo === 'RECEITA' ? "text-emerald-400" : "text-red-400"
                              )}>
                                {transaction.tipo === 'RECEITA' ? '+' : '-'}
                                {formatCurrency(transaction.valor)}
                              </td>
                              <td className={cn(
                                "py-2 px-4 text-xs font-medium text-right",
                                transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                              )}>
                                {formatCurrency(transaction.saldo)}
                              </td>
                              {showActions && (
                                <td className="py-2 px-4">
                                  <button
                                    onClick={() => handleActionClick(transaction)}
                                    className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
              {visibleItems < currentDates.length && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentDates.slice(0, visibleItems).map(date => {
                const group = groupedTransactions[date]
                return (
                  <div key={date} className="space-y-3">
                    {/* Cabeçalho do Grupo Mobile */}
                    <div className="bg-background dark:bg-background-dark rounded-lg p-3">
                      <div className="mb-2">
                        <h3 className="text-base font-semibold text-text dark:text-text-dark">
                          {format(new Date(date), "EEEE", { locale: ptBR })}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 p-2 bg-background/50 dark:bg-background-dark/50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Entradas</p>
                          <p className="text-xs font-medium text-emerald-400">
                            {formatCurrency(group.totalCredito)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saídas</p>
                          <p className="text-xs font-medium text-red-400">
                            {formatCurrency(group.totalDebito)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saldo</p>
                          <p className={cn(
                            "text-xs font-medium",
                            group.saldoFinal >= 0 ? "text-emerald-400" : "text-red-400"
                          )}>
                            {formatCurrency(group.saldoFinal)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Transações Mobile */}
                    {group.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-card dark:bg-card-dark rounded-lg p-3 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors"
                        onClick={() => handleActionClick(transaction)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-text dark:text-text-dark">{transaction.descricao}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(transaction.data), 'HH:mm')}
                              </p>
                              <span className="text-gray-400">•</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.categoria.nome}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "text-sm font-medium",
                              transaction.tipo === 'RECEITA' ? "text-emerald-400" : "text-red-400"
                            )}>
                              {transaction.tipo === 'RECEITA' ? '+' : '-'}
                              {formatCurrency(transaction.valor)}
                            </p>
                            <p className={cn(
                              "text-xs",
                              transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              {formatCurrency(transaction.saldo)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
              {visibleItems < currentDates.length && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Paginação */}
            <div className="mt-4 flex items-center justify-between border-t border-border dark:border-border-dark pt-4">
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPageSelected}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="text-xs bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md py-1 px-2"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, sortedDates.length)} de {sortedDates.length}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-1 rounded-md",
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50"
                  )}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-1 rounded-md",
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium text-text dark:text-text-dark px-2">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "p-1 rounded-md",
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "p-1 rounded-md",
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-500 dark:text-gray-400 hover:bg-background/50 dark:hover:bg-background-dark/50"
                  )}
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
} 