import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Grid3x3, List, Search } from 'lucide-react';

const roleOptions = [
  { value: 'all', label: 'Todas as funções' },
  { value: 'god', label: 'God' },
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
] as const;

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
] as const;

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: Readonly<UserFiltersProps>) {
  return (
    <div className="mb-4">
      {/* Busca, Filtros e Toggle em uma única linha */}
      <div className="flex gap-2">
        {/* Campo de busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card dark:bg-card-dark border-border/50 dark:border-border-dark/50 text-text dark:text-text-dark focus:border-primary-500"
          />
        </div>

        {/* Filtro de função */}
        <Select value={filterRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[180px] h-11 rounded-xl bg-card dark:bg-card-dark border-border/50 dark:border-border-dark/50 text-text dark:text-text-dark focus:border-primary-500">
            <span className="text-sm">
              {(() => {
                if (filterRole === 'all') return 'Todas as funções';
                if (filterRole === 'admin') return 'Administrador';
                if (filterRole === 'god') return 'God';
                return 'Usuário';
              })()}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
            {roleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro de status */}
        <Select value={filterStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] h-11 rounded-xl bg-card dark:bg-card-dark border-border/50 dark:border-border-dark/50 text-text dark:text-text-dark focus:border-primary-500">
            <span className="text-sm">
              {(() => {
                if (filterStatus === 'all') return 'Todos';
                if (filterStatus === 'active') return 'Ativo';
                return 'Inativo';
              })()}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle Grid/List */}
        <div className="flex gap-0.5 rounded-xl bg-card dark:bg-card-dark border border-border/50 dark:border-border-dark/50 h-11 overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'h-full w-11 p-0 rounded-none',
              viewMode === 'grid'
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'text-text dark:text-text-dark hover:bg-background/50 dark:hover:bg-background-dark/50',
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'h-full w-11 p-0 rounded-none',
              viewMode === 'list'
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'text-text dark:text-text-dark hover:bg-background/50 dark:hover:bg-background-dark/50',
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
