import React, { useCallback, useRef, useState } from 'react';

interface UseFileUploadOptions {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect?: (file: File) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({
  accept = '.ofx',
  maxSize,
  onFileSelect,
  onError,
}: UseFileUploadOptions = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (accept && !file.name.toLowerCase().endsWith(accept.replace('.', ''))) {
        onError?.(`Apenas arquivos ${accept} são aceitos.`);
        return false;
      }

      if (maxSize && file.size > maxSize) {
        onError?.(`Arquivo muito grande. Tamanho máximo: ${(maxSize / 1024 / 1024).toFixed(2)} MB`);
        return false;
      }

      return true;
    },
    [accept, maxSize, onError],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect?.(file);
      }
    },
    [validateFile, onFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    selectedFile,
    isDragging,
    fileInputRef,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    openFileDialog,
    reset,
  };
}
