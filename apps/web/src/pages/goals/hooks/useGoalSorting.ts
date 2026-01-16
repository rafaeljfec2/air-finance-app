import { useSortable } from '@/hooks/useSortable';
import { Goal } from '@/services/goalService';

export function useGoalSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'status' | 'targetAmount' | 'currentAmount' | 'deadline'
  >();

  const sortGoals = (goals: Goal[]): Goal[] => {
    return sortData(goals as unknown as Record<string, unknown>[], (item, field) => {
      const goal = item as unknown as Goal;
      switch (field) {
        case 'name':
          return goal.name;
        case 'status':
          return goal.status;
        case 'targetAmount':
          return goal.targetAmount;
        case 'currentAmount':
          return goal.currentAmount;
        case 'deadline':
          return new Date(goal.deadline);
        default:
          return (goal as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as Goal[];
  };

  return {
    sortConfig,
    handleSort,
    sortGoals,
  };
}
