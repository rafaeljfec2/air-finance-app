import { GoalTableRow } from '@/components/goals/GoalTableRow';
import { Card } from '@/components/ui/card';
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { SortableColumn , SortConfig } from '@/components/ui/SortableColumn';
import { Goal } from '@/services/goalService';
import { GoalCard } from './GoalCard';

interface GoalsListProps {
  goals: Goal[];
  viewMode: 'grid' | 'list';
  sortConfig: SortConfig<'name' | 'status' | 'targetAmount' | 'currentAmount' | 'deadline'> | null;
  onSort: (field: 'name' | 'status' | 'targetAmount' | 'currentAmount' | 'deadline') => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function GoalsList({
  goals,
  viewMode,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<GoalsListProps>) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ md: 2, lg: 3, xl: 4 }} gap="md">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </RecordsGrid>
    );
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              <SortableColumn field="name" currentSort={sortConfig} onSort={onSort}>
                Meta
              </SortableColumn>
              <SortableColumn field="currentAmount" currentSort={sortConfig} onSort={onSort}>
                Progresso
              </SortableColumn>
              <SortableColumn field="targetAmount" currentSort={sortConfig} onSort={onSort}>
                Valores
              </SortableColumn>
              <SortableColumn field="deadline" currentSort={sortConfig} onSort={onSort}>
                Prazo
              </SortableColumn>
              <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <GoalTableRow
                key={goal.id}
                goal={goal}
                onEdit={onEdit}
                onDelete={onDelete}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
