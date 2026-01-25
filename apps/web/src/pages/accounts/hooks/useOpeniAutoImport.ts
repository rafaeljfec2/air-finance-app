import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAccounts, importAccounts, type OpeniItem } from '@/services/openiService';

interface UseOpeniAutoImportParams {
  open: boolean;
  existingItems: OpeniItem[] | undefined;
  isLoadingExistingItems: boolean;
  companyId: string;
}

export const useOpeniAutoImport = ({
  open,
  existingItems,
  isLoadingExistingItems,
  companyId,
}: UseOpeniAutoImportParams) => {
  const queryClient = useQueryClient();
  const [importedItems, setImportedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setImportedItems(new Set());
      return;
    }

    if (
      open &&
      existingItems &&
      existingItems.length > 0 &&
      !isLoadingExistingItems
    ) {
      const connectedItems = existingItems.filter(
        item =>
          (item.status === 'CONNECTED' ||
            item.status === 'SYNCING' ||
            item.status === 'SYNCED') &&
          !importedItems.has(item.itemId),
      );

      if (connectedItems.length > 0) {
        console.log(
          '[OpenFinanceModal] Found connected items, importing accounts automatically:',
          connectedItems.map(i => ({ itemId: i.itemId, status: i.status })),
        );

        connectedItems.forEach(async item => {
          try {
            const availableAccounts = await getAccounts(companyId, item.itemId);

            if (availableAccounts && availableAccounts.length > 0) {
              const accountIds = availableAccounts.map(acc => acc.id);
              console.log(
                `[OpenFinanceModal] Auto-importing ${accountIds.length} accounts for item ${item.itemId}`,
              );

              const importResult = await importAccounts(
                companyId,
                item.itemId,
                accountIds,
              );

              console.log(
                '[OpenFinanceModal] Auto-import completed:',
                importResult,
              );

              setImportedItems(prev => new Set(prev).add(item.itemId));
              queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });

              toast.success(
                `${importResult.data.imported} conta(s) importada(s) automaticamente!`,
              );
            } else {
              console.log(
                `[OpenFinanceModal] No accounts found for item ${item.itemId}`,
              );
            }
          } catch (error) {
            console.error(
              `[OpenFinanceModal] Error auto-importing accounts for item ${item.itemId}:`,
              error,
            );
          }
        });
      }
    }
  }, [
    open,
    existingItems,
    isLoadingExistingItems,
    companyId,
    queryClient,
    importedItems,
  ]);

  const resetImportedItems = () => {
    setImportedItems(new Set());
  };

  return {
    resetImportedItems,
  };
};
