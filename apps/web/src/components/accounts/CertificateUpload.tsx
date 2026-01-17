import { cn } from '@/lib/utils';
import { Upload, X, FileCheck, AlertCircle } from 'lucide-react';
import { useRef, useState, DragEvent, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

interface CertificateUploadProps {
  label: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
  error?: string;
  disabled?: boolean;
}

export function CertificateUpload({
  label,
  file,
  onUpload,
  onRemove,
  accept = '.crt,.key,.pem',
  maxSize = 10,
  error,
  disabled = false,
}: Readonly<CertificateUploadProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return;
    }

    // Check file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''));
    
    if (extension && acceptedExtensions.includes(extension)) {
      onUpload(selectedFile);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-3 transition-all cursor-pointer',
          'hover:border-primary-500 dark:hover:border-primary-400',
          'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
          dragActive && 'border-primary-500 bg-primary-50 dark:bg-primary-900/10',
          error && 'border-red-500 dark:border-red-400',
          disabled && 'opacity-50 cursor-not-allowed',
          !file && !error && 'border-gray-300 dark:border-gray-600',
          file && !error && 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {!file ? (
          <div className="flex flex-col items-center text-center">
            <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1.5" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Clique ou arraste o arquivo
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {accept.split(',').join(', ')} (máx {maxSize}MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-1 text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
