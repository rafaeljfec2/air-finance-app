import { Modal } from '@/components/ui/Modal';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { Loader2, Search, Settings } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BudgetSettingsCategoryList } from './BudgetSettingsCategoryList';

interface BudgetSettingsModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
}

export function BudgetSettingsModal({ open, onClose, onSave }: BudgetSettingsModalProps) {
  const {
    categories,
    excludedIds,
    toggleCategory,
    save,
    hasChanges,
    isLoading,
    isSaving,
    error,
    companyId,
  } = useBudgetSettings(open);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const handleSave = async () => {
    const success = await save();
    if (success) {
      onSave();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Configurações do Orçamento" className="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Settings className="h-4 w-4" />
          <span>Selecione as categorias que devem ser excluídas de &quot;Contas a Pagar&quot;</span>
        </div>

        {!isLoading && !error && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar categorias..."
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Pesquisar categorias"
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        )}
        {!isLoading && error && <div className="text-center py-8 text-red-500">{error}</div>}
        {!isLoading && !error && (
          <div className="max-h-80 overflow-y-auto border rounded-lg dark:border-gray-700">
            <BudgetSettingsCategoryList
              categories={filteredCategories}
              excludedIds={excludedIds}
              onToggle={toggleCategory}
              isEmptySearch={searchQuery.trim() !== '' && filteredCategories.length === 0}
            />
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Categorias marcadas não aparecerão na seção &quot;Contas a Pagar&quot; do orçamento. Útil
          para evitar duplicação com faturas de cartão de crédito.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || isSaving || !companyId}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}
