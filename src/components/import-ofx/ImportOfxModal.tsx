import { Loading } from '@/components/Loading';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { Account } from '@/services/accountService';
import type { ImportOfxResponse, InstallmentTransaction } from '@/services/transactionService';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { AccountSelector } from './AccountSelector';
import { FileUploadArea } from './FileUploadArea';
import { InstallmentsModal } from './InstallmentsModal';
import { useFileUpload } from './hooks/useFileUpload';

interface ImportOfxModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onImport: (file: File, accountId: string) => Promise<ImportOfxResponse>;
  onCreateInstallments?: (
    installments: InstallmentTransaction[],
    accountId: string,
  ) => Promise<void>;
  isImporting?: boolean;
}

export function ImportOfxModal({
  open,
  onClose,
  accounts,
  onImport,
  onCreateInstallments,
  isImporting = false,
}: Readonly<ImportOfxModalProps>) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [detectedInstallments, setDetectedInstallments] = useState<InstallmentTransaction[]>([]);
  const [showInstallmentsModal, setShowInstallmentsModal] = useState(false);
  const [lastImportedAccountId, setLastImportedAccountId] = useState<string | null>(null);
  const [isCreatingInstallments, setIsCreatingInstallments] = useState(false);

  const {
    selectedFile,
    isDragging,
    fileInputRef,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    openFileDialog,
    reset: resetFileUpload,
  } = useFileUpload({
    accept: '.ofx',
  });

  const handleImport = async () => {
    if (!selectedFile || !selectedAccountId) return;

    try {
      const result = await onImport(selectedFile, selectedAccountId);

      // Check for installment transactions
      if (result.installmentTransactions && result.installmentTransactions.length > 0) {
        console.log('Found installment transactions, opening modal');
        setDetectedInstallments(result.installmentTransactions);
        setLastImportedAccountId(result.accountId || selectedAccountId);
        setShowInstallmentsModal(true);
        // Don't close the import modal yet, wait for user to handle installments
      } else {
        // No installments, close modal and reset form
        resetFileUpload();
        setSelectedAccountId(null);
        onClose();
      }
    } catch (error: unknown) {
      // Error handling is done in the parent component
      console.error('Import error:', error);
    }
  };

  const handleCreateInstallments = async (installments: InstallmentTransaction[]) => {
    if (!onCreateInstallments || !lastImportedAccountId) return;

    try {
      setIsCreatingInstallments(true);
      await onCreateInstallments(installments, lastImportedAccountId ?? '');

      // Close both modals and reset form
      setShowInstallmentsModal(false);
      setDetectedInstallments([]);
      setLastImportedAccountId(null);
      resetFileUpload();
      setSelectedAccountId(null);
      onClose();
    } catch (error: unknown) {
      console.error('Error creating installments:', error);
      throw error; // Re-throw to let InstallmentsModal handle the error
    } finally {
      setIsCreatingInstallments(false);
    }
  };

  const handleCloseInstallmentsModal = () => {
    setShowInstallmentsModal(false);
    setDetectedInstallments([]);
    setLastImportedAccountId(null);
    // Close import modal and reset form
    resetFileUpload();
    setSelectedAccountId(null);
    onClose();
  };

  const canImport = selectedFile && selectedAccountId && !isImporting;

  return (
    <Modal open={open} onClose={onClose} title="Importar Extrato OFX" className="max-w-2xl">
      <div className="space-y-6 p-6">
        <AccountSelector
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountChange={setSelectedAccountId}
        />

        <FileUploadArea
          selectedFile={selectedFile}
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          accept=".ofx"
          onFileInputChange={handleFileInputChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemoveFile={handleRemoveFile}
          onOpenFileDialog={openFileDialog}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-dark">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isImporting}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!canImport}
            className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isImporting ? (
              <>
                <Loading size="small" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Importar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Installments Modal */}
      <InstallmentsModal
        open={showInstallmentsModal}
        onClose={handleCloseInstallmentsModal}
        installments={detectedInstallments}
        accountId={lastImportedAccountId || ''}
        onConfirm={handleCreateInstallments}
        isCreating={isCreatingInstallments}
      />
    </Modal>
  );
}
