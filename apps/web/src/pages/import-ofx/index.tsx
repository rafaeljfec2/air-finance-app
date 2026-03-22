import { endOfMonth, startOfMonth } from 'date-fns';
import { useState } from 'react';

import { ImportOfxModal } from '@/components/import-ofx/ImportOfxModal';
import { TransactionGrid } from '@/components/transactions/TransactionGrid';
import { useAccounts } from '@/hooks/useAccounts';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useCategories } from '@/hooks/useCategories';
import { useExtracts } from '@/hooks/useExtracts';
import { usePreviousBalance } from '@/hooks/useTransactions';
import { ViewDefault } from '@/layouts/ViewDefault';
import { TransactionSummary } from '@/pages/transactions/components/TransactionSummary';
import { formatDateToLocalISO } from '@/utils/date';

import { ImportOfxFilters } from './components/ImportOfxFilters';
import { ImportOfxHeader } from './components/ImportOfxHeader';
import { useImportOfxMutations } from './hooks/useImportOfxMutations';
import { useImportOfxTransactions } from './hooks/useImportOfxTransactions';

export function ImportOfxPage() {
  const { activeCompany } = useActiveCompany();
  const companyId = activeCompany?.id ?? '';

  const [startDateObj, setStartDateObj] = useState<Date | undefined>(() =>
    startOfMonth(new Date()),
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(() => endOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [showImportModal, setShowImportModal] = useState(false);

  const startDate = startDateObj ? formatDateToLocalISO(startDateObj) : '';
  const endDate = endDateObj ? formatDateToLocalISO(endDateObj) : '';

  const { accounts } = useAccounts();
  const { categories } = useCategories(companyId);

  const {
    data: extracts = [],
    isLoading,
    isFetching,
    refetch,
  } = useExtracts(companyId, startDate, endDate, selectedAccountId);

  const { previousBalance = 0 } = usePreviousBalance(
    companyId,
    startDate,
    selectedAccountId,
    'extracts',
  );

  const { handleImport, handleCreateInstallments, isImporting } = useImportOfxMutations({
    companyId,
    refetch: () => {
      refetch();
    },
    onImportSuccess: (hasInstallments) => {
      if (!hasInstallments) {
        setShowImportModal(false);
      }
    },
    onImportError: () => {
      setShowImportModal(false);
    },
  });

  const { transactions, totals } = useImportOfxTransactions({
    companyId,
    extracts,
    accounts,
    categories,
    startDate,
    endDate,
    selectedAccountId,
    previousBalance,
    searchTerm,
  });

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-2 sm:py-4">
          <ImportOfxHeader
            onImportClick={() => setShowImportModal(true)}
            disableImport={!companyId}
          />

          <TransactionSummary
            totalCredits={totals.totalCredits}
            totalDebits={totals.totalDebits}
            finalBalance={totals.finalBalance}
          />

          <ImportOfxFilters
            startDate={startDateObj}
            setStartDate={setStartDateObj}
            endDate={endDateObj}
            setEndDate={setEndDateObj}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
            accounts={(accounts || []).map((acc) => ({
              id: acc.id,
              name: acc.name,
              type: acc.type,
              accountNumber: acc.accountNumber ?? undefined,
              agency: acc.agency ?? undefined,
            }))}
          />

          <TransactionGrid
            transactions={transactions}
            isLoading={isLoading || isFetching}
            showActions={false}
            resetPageKey={`${selectedAccountId}-${startDate}-${endDate}-${searchTerm}`}
            spacious={true}
          />
        </div>
      </div>

      <ImportOfxModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        accounts={accounts || []}
        onImport={handleImport}
        onCreateInstallments={handleCreateInstallments}
        isImporting={isImporting}
      />
    </ViewDefault>
  );
}
