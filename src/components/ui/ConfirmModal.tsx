import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react';
import { Button } from './button';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
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
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-card dark:bg-card-dark rounded-2xl p-8 shadow-2xl max-w-sm mx-auto flex flex-col items-center border-2 animate-bounce-in ${danger ? 'border-red-500/30' : 'border-primary-500/20'}`}
      >
        <div className="animate-bounce-in-delayed">
          {icon ?? (
            <ExclamationTriangleIcon
              className={`h-10 w-10 mb-3 ${danger ? 'text-red-500' : 'text-primary-500'}`}
            />
          )}
        </div>
        <h3
          className={`text-lg font-bold mb-2 text-center animate-slide-in-delayed ${danger ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}
        >
          {title}
        </h3>
        <div className="text-sm mb-6 text-center text-text dark:text-text-dark animate-slide-in-delayed-2">
          {description}
        </div>
        <div className="flex gap-2 justify-center w-full animate-slide-in-delayed-3">
          <Button
            variant="destructive"
            onClick={onCancel}
            ref={cancelRef}
            className="bg-red-600 hover:bg-red-700"
          >
            {cancelLabel}
          </Button>
          <Button variant="success" onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
