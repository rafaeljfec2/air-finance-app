import { Loading } from '@/components/Loading';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { Account } from '@/services/accountService';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { AccountSelector } from './AccountSelector';
import { FileUploadArea } from './FileUploadArea';
import { useFileUpload } from './hooks/useFileUpload';

interface ImportOfxModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onImport: (file: File, accountId: string) => Promise<void>;
  isImporting?: boolean;
}

export function ImportOfxModal({
  open,
  onClose,
  accounts,
  onImport,
  isImporting = false,
}: Readonly<ImportOfxModalProps>) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

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
      await onImport(selectedFile, selectedAccountId);
      // Reset form on success
      resetFileUpload();
      setSelectedAccountId(null);
      onClose();
    } catch (error: unknown) {
      // Error handling is done in the parent component
      console.error('Import error:', error);
    }
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
    </Modal>
  );
}
