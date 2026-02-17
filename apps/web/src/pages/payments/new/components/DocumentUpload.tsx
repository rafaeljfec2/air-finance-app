import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface DocumentUploadProps {
  readonly onParsed: (result: {
    detectedType: string;
    confidence: number;
    fields: Record<string, unknown>;
  }) => void;
  readonly onParseFile: (
    file: File,
  ) => Promise<{ detectedType: string; confidence: number; fields: Record<string, unknown> }>;
  readonly disabled?: boolean;
}

const ACCEPTED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']);

const ACCEPT_STRING = '.pdf,.jpg,.jpeg,.png';
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUpload({ onParsed, onParseFile, disabled }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      return 'Formato não suportado. Envie um PDF, JPG ou PNG.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        setStatus('error');
        return;
      }

      setSelectedFile(file);
      setStatus('uploading');
      setErrorMessage('');

      try {
        const result = await onParseFile(file);
        setStatus('success');
        onParsed(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao processar documento.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [onParseFile, onParsed, validateFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <section
        aria-label="Upload de documento para preenchimento automático"
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 transition-colors',
          isDragging && 'border-primary-500 bg-primary-50 dark:bg-primary-900/20',
          status === 'idle' &&
            !isDragging &&
            'border-border dark:border-border-dark bg-background dark:bg-background-dark',
          status === 'uploading' && 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
          status === 'success' && 'border-green-400 bg-green-50 dark:bg-green-900/20',
          status === 'error' && 'border-red-400 bg-red-50 dark:bg-red-900/20',
          disabled && 'opacity-50 pointer-events-none',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled ?? status === 'uploading'}
        />

        <IdleContent status={status} openFileDialog={openFileDialog} />
        <UploadingContent status={status} fileName={selectedFile?.name} />
        <SuccessUploadContent status={status} fileName={selectedFile?.name} onReset={handleReset} />
        <ErrorContent status={status} errorMessage={errorMessage} onReset={handleReset} />
      </section>
    </div>
  );
}

function IdleContent({
  status,
  openFileDialog,
}: {
  readonly status: UploadStatus;
  readonly openFileDialog: () => void;
}) {
  if (status !== 'idle') return null;

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      <div className="text-center">
        <p className="text-sm font-medium text-text dark:text-text-dark">
          Envie um documento para preencher automaticamente
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PDF, JPG ou PNG · Boleto, DARF, comprovante PIX ou TED
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={openFileDialog}
        className="mt-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
      >
        <Upload className="h-3.5 w-3.5 mr-1.5" />
        Selecionar arquivo
      </Button>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
        <Sparkles className="h-3 w-3" />
        Leitura feita por IA · Revise os dados antes de confirmar
      </p>
    </div>
  );
}

function UploadingContent({
  status,
  fileName,
}: {
  readonly status: UploadStatus;
  readonly fileName?: string;
}) {
  if (status !== 'uploading') return null;

  return (
    <div className="flex items-center gap-3 py-2">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text dark:text-text-dark truncate flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
          IA analisando documento...
        </p>
        {fileName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            <FileText className="h-3 w-3 flex-shrink-0" />
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
}

function SuccessUploadContent({
  status,
  fileName,
  onReset,
}: {
  readonly status: UploadStatus;
  readonly fileName?: string;
  readonly onReset: () => void;
}) {
  if (status !== 'success') return null;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 min-w-0">
        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Documento processado pela IA
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {fileName ? `${fileName} · ` : ''}Revise os campos preenchidos
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        aria-label="Enviar outro documento"
      >
        <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}

function ErrorContent({
  status,
  errorMessage,
  onReset,
}: {
  readonly status: UploadStatus;
  readonly errorMessage: string;
  readonly onReset: () => void;
}) {
  if (status !== 'error') return null;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 min-w-0">
        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">Falha na leitura</p>
          <p className="text-xs text-red-600 dark:text-red-400 truncate">{errorMessage}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        aria-label="Tentar novamente"
      >
        <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}
