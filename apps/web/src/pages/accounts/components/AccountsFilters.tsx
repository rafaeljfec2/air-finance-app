import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Banknote, Grid3x3, Landmark, List, Search, Wallet } from 'lucide-react';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote },
  { value: 'savings', label: 'Poupança', icon: Wallet },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet },
  { value: 'investment', label: 'Investimento', icon: Landmark },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

function getTypeLabel(type: AccountType): string {
  return accountTypes.find((t) => t.value === type)?.label ?? type;
}

interface AccountsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function AccountsFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  viewMode,
  onViewModeChange,
}: Readonly<AccountsFiltersProps>) {
  return (
    <div className="space-y-3 mb-4">
      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome ou instituição..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-card dark:bg-card-dark border-border/50 dark:border-border-dark/50 text-text dark:text-text-dark focus:border-primary-500"
        />
      </div>

      {/* Filtro e Toggle de visualização */}
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="flex-1 h-11 rounded-xl bg-card dark:bg-card-dark border-border/50 dark:border-border-dark/50 text-text dark:text-text-dark focus:border-primary-500">
            <span className="text-sm">
              {filterType === 'all' ? 'Todos os tipos' : getTypeLabel(filterType as AccountType)}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
            <SelectItem value="all">Todos os tipos</SelectItem>
            {accountTypes.map((opt) => (
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
