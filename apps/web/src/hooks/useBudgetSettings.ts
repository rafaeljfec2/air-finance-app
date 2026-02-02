import { getCategories, type Category } from '@/services/categoryService';
import { budgetService, type BudgetSettings } from '@/services/budgetService';
import { useCompanyStore } from '@/stores/company';
import { useCallback, useEffect, useMemo, useState } from 'react';

function sortedIdsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortFn = (x: string, y: string) => x.localeCompare(y);
  const sortedA = [...a].sort(sortFn);
  const sortedB = [...b].sort(sortFn);
  return sortedA.every((id, i) => id === sortedB[i]);
}

export function useBudgetSettings(open: boolean) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);
    try {
      const [categoriesData, settingsData] = await Promise.all([
        getCategories(companyId),
        budgetService.getSettings(companyId),
      ]);

      const expenseCategories = categoriesData.filter((c) => c.type === 'expense');
      setCategories(expenseCategories);
      setSettings(settingsData);
      setExcludedIds(new Set(settingsData.excludedCategoryIds));
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (open && companyId) {
      loadData();
    }
  }, [open, companyId, loadData]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    if (!companyId) return;

    setIsSaving(true);
    setError(null);
    try {
      await budgetService.updateExcludedCategories(companyId, Array.from(excludedIds));
      setSettings({ companyId, excludedCategoryIds: Array.from(excludedIds) });
      return true;
    } catch (err) {
      setError('Erro ao salvar configurações');
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [companyId, excludedIds]);

  const hasChanges = useMemo(() => {
    if (!settings) return false;
    return !sortedIdsEqual(Array.from(excludedIds), settings.excludedCategoryIds);
  }, [settings, excludedIds]);

  return {
    categories,
    excludedIds,
    toggleCategory,
    save,
    hasChanges,
    isLoading,
    isSaving,
    error,
    companyId,
  };
}
