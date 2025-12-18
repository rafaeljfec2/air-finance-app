import { useState, useRef, useMemo, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { Loading } from '@/components/Loading';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Account } from '@/services/accountService';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accountOptions: ComboBoxOption<string>[] = useMemo(() => {
    return accounts
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
      .map((account) => ({
        value: account.id,
        label: `${account.name} ${account.accountNumber}`,
      }));
  }, [accounts]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !selectedAccountId) return;

    try {
      await onImport(selectedFile, selectedAccountId);
      // Reset form on success
      setSelectedFile(null);
      setSelectedAccountId(null);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const canImport = selectedFile && selectedAccountId && !isImporting;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Importar Extrato OFX"
      className="max-w-2xl"
    >
      <div className="space-y-6 p-6">
        {/* Account Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text dark:text-text-dark">
            Conta <span className="text-red-500">*</span>
          </label>
          <ComboBox
            options={accountOptions}
            value={selectedAccountId}
            onValueChange={(value) => setSelectedAccountId(value ?? null)}
            placeholder="Selecione a conta"
            searchable
            searchPlaceholder="Buscar conta..."
            className="w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            maxHeight="max-h-56"
            renderItem={(option) => {
              const account = accounts.find((acc) => acc.id === option.value);
              if (!account) return <span>{option.label}</span>;
              return (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{account.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {account.accountNumber}
                  </span>
                </div>
              );
            }}
            renderTrigger={(option, displayValue) => {
              if (!option) {
                return <span>{displayValue}</span>;
              }
              const account = accounts.find((acc) => acc.id === option.value);
              if (!account) return <span>{displayValue}</span>;
              return (
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-text dark:text-text-dark text-sm">
                    {account.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {account.accountNumber}
                  </span>
                </div>
              );
            }}
          />
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text dark:text-text-dark">
            Arquivo OFX <span className="text-red-500">*</span>
          </label>
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 transition-colors',
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-border dark:border-border-dark bg-background dark:bg-background-dark',
              selectedFile && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".ofx"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Remover arquivo"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-sm text-text dark:text-text-dark mb-2">
                  Arraste e solte o arquivo OFX aqui
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">ou</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar arquivo
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Apenas arquivos .ofx são aceitos
                </p>
              </div>
            )}
          </div>
        </div>

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

