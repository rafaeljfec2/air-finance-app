import React, { InputHTMLAttributes } from 'react';
import { useTheme } from '@/stores/useTheme';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: string;
  label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ error, label, ...props }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {label}
        </label>
      )}
      <input
        className={`
          w-full h-12 rounded-lg px-4
          ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
          ${error ? 'border-red-500' : 'border-gray-300'}
          border focus:outline-none focus:ring-2 focus:ring-primary-500
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};
