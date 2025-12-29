import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import { RecurringTransaction } from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrency } from '@/utils/formatters';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Edit,
    Trash2,
} from 'lucide-react';

interface RecurringTransactionTableRowProps {
  recurringTransaction: RecurringTransaction;
  onEdit: (recurringTransaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function RecurringTransactionTableRow({
  recurringTransaction,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<RecurringTransactionTableRowProps>) {
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

  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
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
          <div>
            <div className="font-medium text-text dark:text-text-dark">
              {recurringTransaction.description}
            </div>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1',
                isIncome
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30',
              )}
            >
              {isIncome ? 'Receita' : 'Despesa'}
            </span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="font-medium text-text dark:text-text-dark">
          {formatCurrency(recurringTransaction.value)}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {frequencyLabels[recurringTransaction.frequency]}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
           {formatDate(recurringTransaction.startDate)}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {categoryName}
        </div>
      </td>
       <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {accountName}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(recurringTransaction)}
            disabled={isUpdating}
             className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(recurringTransaction.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
