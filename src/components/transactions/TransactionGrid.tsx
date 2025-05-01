import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { MoreHorizontal, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border dark:border-border-dark">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Descrição</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Conta</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Crédito</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Débito</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text dark:text-text-dark">Saldo</th>
                    {showActions && <th className="w-10"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {transactionsWithBalance.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-background dark:hover:bg-background-dark transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
                        {formatDate(transaction.data)}
                      </td>
                      <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
                        {transaction.categoria.nome}
                      </td>
                      <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
                        {transaction.descricao}
                      </td>
                      <td className="py-3 px-4 text-sm text-text dark:text-text-dark">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {transactionsWithBalance.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-card dark:bg-card-dark rounded-lg p-4 space-y-3 hover:bg-background dark:hover:bg-background-dark transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text dark:text-text-dark">{transaction.descricao}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.data)}</p>
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
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="space-y-1">
                      <p>Categoria: {transaction.categoria.nome}</p>
                      <p>Conta: {transaction.conta.nome}</p>
                    </div>
                    {showActions && (
                      <button
                        onClick={() => handleActionClick(transaction)}
                        className="p-2 hover:bg-background dark:hover:bg-background-dark rounded-full transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
} 