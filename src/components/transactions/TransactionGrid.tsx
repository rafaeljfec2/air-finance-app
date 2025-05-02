import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { MoreHorizontal, ChevronRight, Loader2, ChevronLeft, ChevronRightIcon, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Tooltip } from '@/components/ui/tooltip'

type SortField = 'hora' | 'categoria' | 'descricao' | 'conta' | 'credito' | 'debito' | 'saldo'
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
        case 'credito':
          return sortConfig.direction === 'asc'
            ? (a.credito || 0) - (b.credito || 0)
            : (b.credito || 0) - (a.credito || 0)
        case 'debito':
          return sortConfig.direction === 'asc'
            ? (a.debito || 0) - (b.debito || 0)
            : (b.debito || 0) - (a.debito || 0)
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

  // Lógica de paginação
  const sortedDates = useMemo(() => {
    return Object.keys(transactionsWithBalance).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }, [transactionsWithBalance])

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
  const SortableHeader = ({ field, children, className }: { 
    field: SortField
    children: React.ReactNode
    className?: string 
  }) => (
    <th 
      onClick={() => toggleSort(field)}
      className={cn(
        "text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors group select-none",
        className
      )}
      role="columnheader"
      aria-sort={
        sortConfig.field === field 
          ? sortConfig.direction === 'asc' 
            ? 'ascending' 
            : 'descending'
          : 'none'
      }
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-all",
          sortConfig.field === field 
            ? "opacity-100" 
            : "opacity-0 group-hover:opacity-50",
          sortConfig.field === field && sortConfig.direction === 'asc' && "rotate-180"
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
              <div className="w-full">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[6%] sm:w-[8%]" /> {/* Hora */}
                    <col className="w-[12%] sm:w-[15%]" /> {/* Categoria */}
                    <col className="w-[20%] sm:w-[25%]" /> {/* Descrição */}
                    <col className="w-[12%] sm:w-[15%]" /> {/* Conta */}
                    <col className="w-[12%]" /> {/* Crédito */}
                    <col className="w-[12%]" /> {/* Débito */}
                    <col className="w-[12%]" /> {/* Saldo */}
                    {showActions && <col className="w-[1%]" />} {/* Ações */}
                  </colgroup>
                  <thead>
                    <tr className="bg-background/30 dark:bg-background-dark/30">
                      <SortableHeader field="hora">Data/Hora</SortableHeader>
                      <SortableHeader field="categoria">Categoria</SortableHeader>
                      <SortableHeader field="descricao">Descrição</SortableHeader>
                      <SortableHeader field="conta">Conta</SortableHeader>
                      <SortableHeader field="credito" className="text-right pr-8">Crédito</SortableHeader>
                      <SortableHeader field="debito" className="text-right pr-8">Débito</SortableHeader>
                      <SortableHeader field="saldo" className="text-right pr-8">Saldo</SortableHeader>
                      {showActions && <th className="w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                    {sortTransactions(transactionsWithBalance).slice((currentPage - 1) * itemsPerPageSelected, currentPage * itemsPerPageSelected).map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-background/70 dark:hover:bg-background-dark/70 transition-colors"
                      >
                        <td className="py-2 px-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {format(new Date(transaction.data), 'dd/MM HH:mm')}
                        </td>
                        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
                          <Tooltip content={transaction.categoria.nome}>
                            <span className="block overflow-hidden text-ellipsis">
                              {transaction.categoria.nome}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-2 px-4 text-xs font-medium text-text dark:text-text-dark overflow-hidden text-ellipsis">
                          <Tooltip content={transaction.descricao}>
                            <span className="block overflow-hidden text-ellipsis">
                              {transaction.descricao}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-2 px-4 text-xs text-text dark:text-text-dark whitespace-nowrap overflow-hidden text-ellipsis">
                          <Tooltip content={transaction.conta.nome}>
                            <span className="block overflow-hidden text-ellipsis">
                              {transaction.conta.nome}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-2 px-4 text-xs font-medium text-right text-emerald-400 whitespace-nowrap pr-8">
                          {transaction.credito ? formatCurrency(transaction.credito) : '-'}
                        </td>
                        <td className="py-2 px-4 text-xs font-medium text-right text-red-400 whitespace-nowrap pr-8">
                          {transaction.debito ? formatCurrency(transaction.debito) : '-'}
                        </td>
                        <td className={cn(
                          "py-2 px-4 text-xs font-medium text-right whitespace-nowrap pr-8",
                          transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {formatCurrency(transaction.saldo)}
                        </td>
                        {showActions && (
                          <td className="py-2 px-4 w-10">
                            <button
                              onClick={() => handleActionClick(transaction)}
                              className="text-gray-500 dark:text-gray-400 hover:text-text dark:hover:text-text-dark"
                              aria-label="Mais ações"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {sortTransactions(transactionsWithBalance).slice((currentPage - 1) * itemsPerPageSelected, currentPage * itemsPerPageSelected).map((transaction) => (
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
                          {format(new Date(transaction.data), 'dd/MM HH:mm')}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.categoria.nome}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.conta.nome}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {transaction.credito > 0 && (
                        <p className="text-sm font-medium text-emerald-400">
                          {formatCurrency(transaction.credito)}
                        </p>
                      )}
                      {transaction.debito > 0 && (
                        <p className="text-sm font-medium text-red-400">
                          {formatCurrency(transaction.debito)}
                        </p>
                      )}
                      <p className={cn(
                        "text-xs mt-0.5",
                        transaction.saldo >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {formatCurrency(transaction.saldo)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleItems < currentDates.length && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center py-4"
              >
                <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
              </div>
            )}

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
                  aria-label="Primeira página"
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
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium text-text dark:text-text-dark px-2" role="status">
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
                  aria-label="Próxima página"
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
                  aria-label="Última página"
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