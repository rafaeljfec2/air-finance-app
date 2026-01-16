import React from 'react';

interface IconOption {
  value: string;
  icon: React.ElementType;
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  options: IconOption[];
  className?: string;
  label?: string;
}

export function IconPicker({
  value,
  onChange,
  options,
  className = '',
  label,
}: Readonly<IconPickerProps>) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background dark:bg-background-dark ${
                isSelected ? 'ring-2 ring-primary-500' : ''
              }`}
              aria-label={`Selecionar ícone ${opt.value}`}
              onClick={() => onChange(opt.value)}
            >
              <opt.icon
                className={`h-5 w-5 ${isSelected ? 'text-primary-500' : 'text-text dark:text-text-dark'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
