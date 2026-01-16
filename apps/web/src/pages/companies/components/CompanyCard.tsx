import { RecordCard } from '@/components/ui/RecordCard';
import { cn } from '@/lib/utils';
import { Company } from '@/types/company';
import { formatDate } from '@/utils/date';
import { formatDocument } from '@/utils/formatDocument';

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

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function CompanyCard({
  company,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: Readonly<CompanyCardProps>) {
  return (
    <RecordCard
      onEdit={() => onEdit(company)}
      onDelete={() => onDelete(company.id)}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark mb-1 truncate leading-tight">
            {company.name}
          </h3>
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border',
              getTypeBadgeColor(company.type),
            )}
          >
            {getTypeLabel(company.type)}
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-1">
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">CNPJ/CPF: </span>
          <span className="text-text dark:text-text-dark font-mono">
            {formatDocument(company.cnpj)}
          </span>
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-gray-500 dark:text-gray-400">Fundação: </span>
          <span className="text-text dark:text-text-dark">
            {formatDate(company.foundationDate)}
          </span>
        </div>
        {company.email && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">E-mail: </span>
            <span className="text-text dark:text-text-dark truncate block">{company.email}</span>
          </div>
        )}
        {company.phone && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Telefone: </span>
            <span className="text-text dark:text-text-dark">{company.phone}</span>
          </div>
        )}
        {company.address && (
          <div className="text-[11px] leading-tight">
            <span className="text-gray-500 dark:text-gray-400">Endereço: </span>
            <span className="text-text dark:text-text-dark truncate block">{company.address}</span>
          </div>
        )}
      </div>
    </RecordCard>
  );
}
