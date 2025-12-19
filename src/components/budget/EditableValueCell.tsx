import { Input } from '@/components/ui/input';
import React from 'react';

interface EditableValueCellProps {
  value: number;
  isEditing: boolean;
  editingValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
  onDoubleClick: () => void;
  onValueChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function EditableValueCell({
  value,
  isEditing,
  editingValue,
  inputRef,
  isUpdating,
  onDoubleClick,
  onValueChange,
  onBlur,
  onKeyDown,
}: Readonly<EditableValueCellProps>) {
  if (isEditing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm">R$</span>
        <Input
          ref={inputRef}
          type="text"
          value={editingValue}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-32 h-8 text-right font-medium bg-background dark:bg-background-dark border-primary-500 focus:ring-2 focus:ring-primary-500"
          disabled={isUpdating}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="cursor-pointer hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors px-2 py-1 rounded text-right font-medium whitespace-nowrap"
      onDoubleClick={onDoubleClick}
      title="Clique duas vezes para editar"
    >
      R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </button>
  );
}
