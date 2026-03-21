import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { toast } from '@/components/ui/toast';
import { getAccounts, importAccounts, type OpeniItem } from '@/services/openiService';

interface UseOpeniAutoImportParams {
  readonly open: boolean;
  readonly existingItems: OpeniItem[] | undefined;
  readonly isLoadingExistingItems: boolean;
  readonly companyId: string;
}

const DELAY_BETWEEN_IMPORTS_MS = 3000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const useOpeniAutoImport = ({
  open,
  existingItems,
  isLoadingExistingItems,
  companyId,
}: UseOpeniAutoImportParams) => {
  const queryClient = useQueryClient();
  const importedItemsRef = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!open) {
      importedItemsRef.current = new Set();
      isProcessingRef.current = false;
      return;
    }

    if (!existingItems || existingItems.length === 0 || isLoadingExistingItems) return;
    if (isProcessingRef.current) return;

    const connectedItems = existingItems.filter(
      (item) =>
        (item.status === 'CONNECTED' || item.status === 'SYNCING' || item.status === 'SYNCED') &&
        !importedItemsRef.current.has(item.itemId),
    );

    if (connectedItems.length === 0) return;

    isProcessingRef.current = true;

    const processItems = async () => {
      for (const item of connectedItems) {
        if (importedItemsRef.current.has(item.itemId)) continue;
        importedItemsRef.current.add(item.itemId);

        try {
          const availableAccounts = await getAccounts(companyId, item.itemId);

          if (availableAccounts && availableAccounts.length > 0) {
            const accountIds = availableAccounts.map((acc) => acc.id);
            const importResult = await importAccounts(companyId, item.itemId, accountIds);
            toast.success(`${importResult.data.imported} conta(s) importada(s) automaticamente!`);
          }
        } catch (error) {
          const status = (error as { response?: { status?: number } })?.response?.status;

          if (status === 403) {
            toast.warning(
              'Limite de contas Open Finance atingido. Adquira mais slots para continuar.',
            );
            break;
          }

          console.error(
            `[OpenFinanceModal] Error auto-importing accounts for item ${item.itemId}:`,
            error,
          );
        }

        if (connectedItems.indexOf(item) < connectedItems.length - 1) {
          await delay(DELAY_BETWEEN_IMPORTS_MS);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['accounts', companyId] });
      isProcessingRef.current = false;
    };

    processItems();
  }, [open, existingItems, isLoadingExistingItems, companyId, queryClient]);

  const resetImportedItems = () => {
    importedItemsRef.current = new Set();
    isProcessingRef.current = false;
  };

  return {
    resetImportedItems,
  };
};
