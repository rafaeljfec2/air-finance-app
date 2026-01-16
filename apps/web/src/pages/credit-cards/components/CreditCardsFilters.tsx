import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Grid3x3, List, Search } from 'lucide-react';

interface CreditCardsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function CreditCardsFilters({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: Readonly<CreditCardsFiltersProps>) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2 border border-border dark:border-border-dark rounded-md overflow-hidden bg-background dark:bg-background-dark">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'flex-1 rounded-none border-0',
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
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
                'flex-1 rounded-none border-0',
                viewMode === 'list'
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
