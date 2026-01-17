import { cn } from '@/lib/utils';
import { Company } from '@/types/company';
import { formatDate } from '@/utils/date';
import { formatDocument } from '@/utils/formatDocument';
import { Building2, FileText, Calendar, Phone, Mail, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    matriz: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    filial: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    holding: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    prestadora: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    outra: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
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
    <div className="w-full rounded-lg transition-all text-left bg-white dark:bg-card-dark hover:shadow-md p-3 border border-border/50 dark:border-border-dark/50">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Ícone */}
          <div className="p-2 rounded-lg shrink-0 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            <Building2 className="h-4 w-4" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Nome */}
            <h3 className="font-bold text-sm text-text dark:text-text-dark mb-1 line-clamp-1">
              {company.name}
            </h3>

            {/* Badge Tipo */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-2',
                getTypeBadgeColor(company.type),
              )}
            >
              {getTypeLabel(company.type)}
            </span>

            {/* Informações em Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {/* CNPJ */}
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate font-mono text-[11px]">
                  {formatDocument(company.cnpj)}
                </span>
              </div>

              {/* Data */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {formatDate(company.foundationDate)}
                </span>
              </div>

              {/* Telefone */}
              {company.phone && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {company.phone}
                  </span>
                </div>
              )}

              {/* E-mail */}
              {company.email && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {company.email}
                  </span>
                </div>
              )}

              {/* Endereço - Span completo */}
              {company.address && (
                <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {company.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Vertical */}
        <div className="shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 data-[state=open]:bg-muted"
                disabled={isUpdating || isDeleting}
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onEdit(company)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-text-dark transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(company.id)}
                  className="flex items-center w-full px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors text-left gap-2"
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
