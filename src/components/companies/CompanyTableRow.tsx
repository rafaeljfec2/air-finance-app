import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Company } from '@/types/company';
import { formatDate } from '@/utils/date';
import { formatDocument } from '@/utils/formatDocument';
import { Edit, Trash2 } from 'lucide-react';

interface CompanyTableRowProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const typeOptions = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial', label: 'Filial' },
  { value: 'holding', label: 'Holding' },
  { value: 'prestadora', label: 'Prestadora' },
  { value: 'outra', label: 'Outra' },
] as const;

type CompanyType = 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';

function getTypeLabel(type: CompanyType): string {
  return typeOptions.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: CompanyType): string {
  const colors: Record<CompanyType, string> = {
    matriz: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    filial: 'bg-green-500/20 text-green-400 border-green-500/30',
    holding: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    prestadora: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    outra: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[type] ?? colors.outra;
}

export function CompanyTableRow({
  company,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<CompanyTableRowProps>) {
  return (
    <tr className="border-b border-border dark:border-border-dark hover:bg-card dark:hover:bg-card-dark transition-colors">
      <td className="p-4">
        <div>
          <div className="font-medium text-text dark:text-text-dark">{company.name}</div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1',
              getTypeBadgeColor(company.type),
            )}
          >
            {getTypeLabel(company.type)}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">CNPJ/CPF: </span>
            <span className="text-text dark:text-text-dark font-mono text-xs">
              {formatDocument(company.cnpj)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Fundação: </span>
            <span className="text-text dark:text-text-dark text-xs">
              {formatDate(company.foundationDate)}
            </span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          {company.email && (
            <div className="text-sm text-text dark:text-text-dark truncate max-w-[200px]" title={company.email}>
              {company.email}
            </div>
          )}
          {company.phone && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {company.phone}
            </div>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={company.address}>
          {company.address || '-'}
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(company)}
            disabled={isUpdating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(company.id)}
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
