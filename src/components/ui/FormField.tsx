import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">
        {label}
      </label>
      {children}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
