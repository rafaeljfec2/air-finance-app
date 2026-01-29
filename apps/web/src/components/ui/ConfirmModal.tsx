import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Button } from './button';

interface ConfirmModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly description: string | React.ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly danger?: boolean;
  readonly icon?: React.ReactNode;
  readonly isLoading?: boolean;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-safe z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-safe">
      <div
        className={`bg-card dark:bg-card-dark rounded-2xl p-8 shadow-2xl max-w-md mx-auto flex flex-col items-center border-2 animate-bounce-in ${danger ? 'border-red-500/30' : 'border-primary-500/20'}`}
      >
        <div className="animate-bounce-in-delayed">
          {icon ?? (
            <AlertTriangle
              className={`h-10 w-10 mb-3 ${danger ? 'text-red-500' : 'text-primary-500'}`}
            />
          )}
        </div>
        <h3
          className={`text-lg font-bold mb-2 text-center animate-slide-in-delayed ${danger ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}
        >
          {title}
        </h3>
        <div className="text-sm mb-6 text-left text-text dark:text-text-dark animate-slide-in-delayed-2 w-full">
          {description}
        </div>
        <div className="flex gap-2 justify-center w-full animate-slide-in-delayed-3">
          <Button
            variant="outline"
            onClick={onCancel}
            ref={cancelRef}
            disabled={isLoading}
            className="border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className={danger ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isLoading ? 'Aguarde...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
