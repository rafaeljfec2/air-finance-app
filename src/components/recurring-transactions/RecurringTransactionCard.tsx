import { RecordCard } from '@/components/ui/RecordCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import { RecurringTransaction } from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrency } from '@/utils/formatters';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  DollarSign,
  Edit,
  Repeat,
  Tag,
  Trash2,
} from 'lucide-react';

interface RecurringTransactionCardProps {
  recurringTransaction: RecurringTransaction;
  onEdit: (recurringTransaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  viewMode?: 'grid' | 'list';
}

export function RecurringTransactionCard({
  recurringTransaction,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  viewMode = 'grid',
}: Readonly<RecurringTransactionCardProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { categories } = useCategories(companyId);
  const { accounts } = useAccounts();

  const isIncome = recurringTransaction.type === 'Income';
  const frequencyLabels: Record<string, string> = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
    yearly: 'Anual',
  };

  const categoryName =
    categories?.find((cat) => cat.id === recurringTransaction.category)?.name || 'Sem categoria';
  const accountName =
    accounts?.find((acc) => acc.id === recurringTransaction.accountId)?.name || 'Sem conta';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (viewMode === 'list') {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Informações principais */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20',
                )}
              >
                {isIncome ? (
                  <ArrowUpCircle className="h-6 w-6 text-emerald-400" />
                ) : (
                  <ArrowDownCircle className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                    {recurringTransaction.description}
                  </h3>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      isIncome
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30',
                    )}
                  >
                    {isIncome ? 'Receita' : 'Despesa'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium text-text dark:text-text-dark">
                      {formatCurrency(recurringTransaction.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    <span>{frequencyLabels[recurringTransaction.frequency]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(recurringTransaction.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="truncate">{categoryName}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Ações */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(recurringTransaction)}
                disabled={isUpdating || isDeleting}
                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(recurringTransaction.id)}
                disabled={isUpdating || isDeleting}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <RecordCard
      onEdit={() => onEdit(recurringTransaction)}
      onDelete={() => onDelete(recurringTransaction.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20',
            )}
          >
            {isIncome ? (
              <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
            ) : (
              <ArrowDownCircle className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-0.5 truncate leading-tight">
              {recurringTransaction.description}
            </h3>
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border',
                isIncome
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30',
              )}
            >
              {isIncome ? 'Receita' : 'Despesa'}
            </span>
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-1">
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Valor: </span>
          <span className="text-text dark:text-text-dark font-semibold">
            {formatCurrency(recurringTransaction.value)}
          </span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Frequência: </span>
          <span className="text-text dark:text-text-dark">
            {frequencyLabels[recurringTransaction.frequency]}
          </span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Data inicial: </span>
          <span className="text-text dark:text-text-dark">
            {formatDate(recurringTransaction.startDate)}
          </span>
        </div>
        {recurringTransaction.repeatUntil && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Data final: </span>
            <span className="text-text dark:text-text-dark">
              {formatDate(recurringTransaction.repeatUntil)}
            </span>
          </div>
        )}
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Categoria: </span>
          <span className="text-text dark:text-text-dark truncate block">{categoryName}</span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Conta: </span>
          <span className="text-text dark:text-text-dark truncate block">{accountName}</span>
        </div>
      </div>
    </RecordCard>
  );
}
