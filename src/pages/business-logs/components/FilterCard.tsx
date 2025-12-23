import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ComboBox } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { entityTypeLabels, operationLabels } from '../constants';

interface FilterCardProps {
  startDate: string;
  endDate: string;
  searchTerm: string;
  filterEntityType: string;
  filterOperation: string;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSearchTermChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  onOperationChange: (value: string) => void;
  onSearch: () => void;
}

export function FilterCard({
  startDate,
  endDate,
  searchTerm,
  filterEntityType,
  filterOperation,
  onStartDateChange,
  onEndDateChange,
  onSearchTermChange,
  onEntityTypeChange,
  onOperationChange,
  onSearch,
}: FilterCardProps) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
      <div className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                Data Inicial
              </span>
              <DatePicker
                value={startDate}
                onChange={(date) => onStartDateChange(date)}
                placeholder="Data inicial"
                className="bg-background dark:bg-background-dark"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                Data Final
              </span>
              <DatePicker
                value={endDate}
                onChange={(date) => onEndDateChange(date)}
                placeholder="Data final"
                className="bg-background dark:bg-background-dark"
              />
            </div>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">Buscar</span>
            <Search className="absolute left-3 top-9 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Email, ID..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch();
                }
              }}
              className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark"
            />
          </div>

          <div className="min-w-[180px]">
            <ComboBox
              options={[
                { value: 'all', label: 'Todas as entidades' },
                { value: 'Account', label: entityTypeLabels.Account },
                { value: 'Transaction', label: entityTypeLabels.Transaction },
                { value: 'Company', label: entityTypeLabels.Company },
                { value: 'Category', label: entityTypeLabels.Category },
              ]}
              value={filterEntityType}
              onValueChange={(value) => onEntityTypeChange(value ?? 'all')}
              placeholder="Todas as entidades"
            />
          </div>

          <div className="min-w-[180px]">
            <ComboBox
              options={[
                { value: 'all', label: 'Todas as operações' },
                { value: 'create', label: operationLabels.create },
                { value: 'update', label: operationLabels.update },
                { value: 'delete', label: operationLabels.delete },
              ]}
              value={filterOperation}
              onValueChange={(value) => onOperationChange(value ?? 'all')}
              placeholder="Todas as operações"
            />
          </div>

          <Button
            onClick={onSearch}
            className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 whitespace-nowrap"
            title="Pesquisar"
          >
            <Search className="h-4 w-4" />
            Pesquisar
          </Button>
        </div>
      </div>
    </Card>
  );
}

