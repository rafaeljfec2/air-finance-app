import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { MoreHorizontal, ChevronRight, Loader2, ChevronLeft, ChevronRightIcon, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useMemo } from 'react'

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
    acc[date].transactions.push(transaction)
    acc[date].totalCredito += transaction.credito
    acc[date].totalDebito += transaction.debito
    acc[date].saldoFinal = transaction.saldo
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

  return (
    <Card className={cn("bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm", className)}>
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando transações...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              {currentDates.map(date => {
                const group = groupedTransactions[date]
                return (
                  <div key={date} className="mb-8 bg-background/50 dark:bg-background-dark/50 rounded-lg overflow-hidden">
                    {/* Cabeçalho do Grupo */}
                    <div className="bg-background dark:bg-background-dark border-b border-border dark:border-border-dark p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                            {format(new Date(date), "EEEE", { locale: ptBR })}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Movimentação do dia</p>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Entradas</p>
                              <p className="text-sm font-medium text-emerald-400">
                                {formatCurrency(group.totalCredito)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Saídas</p>
                              <p className="text-sm font-medium text-red-400">
                                {formatCurrency(group.totalDebito)}
                              </p>
                            </div>
                            <div className="pl-4 border-l border-border dark:border-border-dark">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Saldo do dia</p>
                              <p className={cn(
                                "text-lg font-semibold",
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
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Hora</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Categoria</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Descrição</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Conta</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Valor</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Saldo</th>
                            {showActions && <th className="w-10"></th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                          {group.transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="hover:bg-background/70 dark:hover:bg-background-dark/70 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(transaction.data), 'HH:mm')}
                              </td>
                              <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
                                {transaction.categoria.nome}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-text dark:text-text-dark">
                                {transaction.descricao}
                              </td>
                              <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
                                {transaction.conta.nome}
                              </td>
                              <td className={cn(
                                "py-3 px-4 text-sm font-medium text-right",
                                transaction.tipo === 'RECEITA' ? "text-emerald-400" : "text-red-400"
                              )}>
                                {transaction.tipo === 'RECEITA' ? '+' : '-'}
                                {formatCurrency(transaction.valor)}
                              </td>
                              <td className={cn(
                                "py-3 px-4 text-sm font-medium text-right",
                                transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                              )}>
                                {formatCurrency(transaction.saldo)}
                              </td>
                              {showActions && (
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleActionClick(transaction)}
                                    className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark"
                                  >
                                    <MoreHorizontal className="h-5 w-5" />
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {currentDates.map(date => {
                const group = groupedTransactions[date]
                return (
                  <div key={date} className="space-y-4">
                    {/* Cabeçalho do Grupo Mobile */}
                    <div className="bg-background dark:bg-background-dark rounded-lg p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                          {format(new Date(date), "EEEE", { locale: ptBR })}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 p-3 bg-background/50 dark:bg-background-dark/50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Entradas</p>
                          <p className="text-sm font-medium text-emerald-400">
                            {formatCurrency(group.totalCredito)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saídas</p>
                          <p className="text-sm font-medium text-red-400">
                            {formatCurrency(group.totalDebito)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo</p>
                          <p className={cn(
                            "text-sm font-medium",
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
                        className="bg-card dark:bg-card-dark rounded-lg p-4 space-y-3 hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-text dark:text-text-dark">{transaction.descricao}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(transaction.data), 'HH:mm')}
                              </p>
                              <span className="text-gray-400">•</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
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
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {transaction.conta.nome}
                            </p>
                          </div>
                        </div>
                        {showActions && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleActionClick(transaction)}
                              className="p-2 hover:bg-background dark:hover:bg-background-dark rounded-full transition-colors"
                            >
                              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-6 border-t border-border dark:border-border-dark pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Itens por página:
                    </span>
                    <select
                      value={itemsPerPageSelected}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="text-sm border border-border dark:border-border-dark rounded-md bg-background dark:bg-background-dark text-text dark:text-text-dark px-2 py-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Página {currentPage} de {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        currentPage === 1
                          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          : "text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
                      )}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        currentPage === 1
                          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          : "text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Números das páginas */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                        let pageNumber: number
                        if (totalPages <= 5) {
                          pageNumber = index + 1
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index
                        } else {
                          pageNumber = currentPage - 2 + index
                        }

                        if (pageNumber > 0 && pageNumber <= totalPages) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={cn(
                                "w-8 h-8 rounded-md text-sm transition-colors",
                                currentPage === pageNumber
                                  ? "bg-primary-500 text-white"
                                  : "text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
                              )}
                            >
                              {pageNumber}
                            </button>
                          )
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        currentPage === totalPages
                          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          : "text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
                      )}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        currentPage === totalPages
                          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          : "text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
                      )}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
} 