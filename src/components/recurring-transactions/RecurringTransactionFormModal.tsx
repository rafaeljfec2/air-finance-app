import { Modal } from '@/components/ui/Modal';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import type {
  CreateRecurringTransaction,
  RecurringTransaction,
} from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import type { FormEvent } from 'react';
import { BasicInfoSection } from './components/BasicInfoSection';
import { ModalFooter } from './components/ModalFooter';
import { ModalHeader } from './components/ModalHeader';
import { RecurrenceSection } from './components/RecurrenceSection';
import { useRecurringTransactionForm } from './hooks/useRecurringTransactionForm';

interface RecurringTransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecurringTransaction) => void;
  recurringTransaction?: RecurringTransaction | null;
  isLoading?: boolean;
}

export function RecurringTransactionFormModal({
  open,
  onClose,
  onSubmit,
  recurringTransaction,
  isLoading = false,
}: Readonly<RecurringTransactionFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { categories } = useCategories(companyId);
  const { accounts } = useAccounts();

  const {
    form,
    errors,
    valueInput,
    handleChange,
    handleValueChange,
    handleDateChange,
    handleSelectChange,
    validate,
    reset,
  } = useRecurringTransactionForm({
    recurringTransaction,
    open,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(form);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEditing = !!recurringTransaction;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col h-[90vh] max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <ModalHeader isEditing={isEditing} onClose={handleClose} />

        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="recurring-transaction-form" className="space-y-6 py-4">
            <BasicInfoSection
              form={form}
              errors={errors}
              valueInput={valueInput}
              categories={categories}
              accounts={accounts}
              onDescriptionChange={handleChange}
              onValueChange={handleValueChange}
              onTypeChange={(value) => handleSelectChange('type', value)}
              onCategoryChange={(value) => handleSelectChange('category', value)}
              onAccountChange={(value) => handleSelectChange('accountId', value)}
            />

            <RecurrenceSection
              form={form}
              errors={errors}
              onStartDateChange={(date) => handleDateChange('startDate', date)}
              onFrequencyChange={(value) => handleSelectChange('frequency', value)}
              onRepeatUntilChange={(date) => handleDateChange('repeatUntil', date)}
            />
          </form>
        </div>

        <ModalFooter isLoading={isLoading} isEditing={isEditing} onCancel={handleClose} />
      </div>
    </Modal>
  );
}
