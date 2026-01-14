import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface OpenAILogsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'success' | 'error';
  onStatusFilterChange: (value: 'all' | 'success' | 'error') => void;
}

export function OpenAILogsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Readonly<OpenAILogsFiltersProps>) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('all')}
              size="sm"
              className={
                statusFilter === 'all'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : ''
              }
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === 'success' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('success')}
              size="sm"
              className={
                statusFilter === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : ''
              }
            >
              Sucesso
            </Button>
            <Button
              variant={statusFilter === 'error' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('error')}
              size="sm"
              className={
                statusFilter === 'error'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : ''
              }
            >
              Erro
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
