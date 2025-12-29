import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Upload, X } from 'lucide-react';
import React from 'react';

interface FileUploadAreaProps {
  selectedFile: File | null;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  accept: string;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveFile: () => void;
  onOpenFileDialog: () => void;
}

export function FileUploadArea({
  selectedFile,
  isDragging,
  fileInputRef,
  accept,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
  onOpenFileDialog,
}: Readonly<FileUploadAreaProps>) {
  return (
    <div className="space-y-2">
      <div className="block text-sm font-medium text-text dark:text-text-dark">
        Arquivo OFX <span className="text-red-500">*</span>
      </div>
      <section
        aria-label="Área de upload de arquivo OFX"
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-border dark:border-border-dark bg-background dark:bg-background-dark',
          selectedFile && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFileInputChange}
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
              onClick={onRemoveFile}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Remover arquivo"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-sm text-text dark:text-text-dark mb-1">
              Arraste e solte o arquivo OFX aqui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">ou</p>
            <Button
              type="button"
              variant="outline"
              onClick={onOpenFileDialog}
              className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar arquivo
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Apenas arquivos .ofx são aceitos
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
