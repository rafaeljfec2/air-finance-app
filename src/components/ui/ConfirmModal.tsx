import React, { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`bg-card dark:bg-card-dark rounded-2xl p-8 shadow-2xl max-w-sm mx-auto flex flex-col items-center border-2 ${danger ? 'border-red-500/30' : 'border-primary-500/20'}`}
      >
        {icon ?? (
          <ExclamationTriangleIcon
            className={`h-10 w-10 mb-3 ${danger ? 'text-red-500' : 'text-primary-500'}`}
          />
        )}
        <h3
          className={`text-lg font-bold mb-2 text-center ${danger ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}
        >
          {title}
        </h3>
        <div className="text-sm mb-6 text-center text-text dark:text-text-dark">{description}</div>
        <div className="flex gap-2 justify-center w-full">
          <Button color="secondary" onClick={onCancel} ref={cancelRef}>
            {cancelLabel}
          </Button>
          <Button color={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
