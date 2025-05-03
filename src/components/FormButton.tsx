import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@/stores/useTheme';

interface FormButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  loading,
  disabled,
  variant = 'primary',
  fullWidth,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700';
      case 'secondary':
        return 'bg-secondary-600 hover:bg-secondary-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-primary-600 hover:bg-primary-700';
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      className={`
        h-12 rounded-lg px-4 justify-center items-center
        ${getVariantClasses()}
        ${disabled || loading ? 'opacity-60' : 'opacity-100'}
        ${fullWidth ? 'w-full' : 'w-auto'}
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-base font-semibold">{children}</Text>
      )}
    </TouchableOpacity>
  );
};
