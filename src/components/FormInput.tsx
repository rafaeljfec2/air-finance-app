import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { useTheme } from '@/stores/useTheme';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  error?: string;
  label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ error, label, ...props }) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="mb-4">
      {label && (
        <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={`
          h-12 rounded-lg px-4
          ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}
          ${error ? 'border-red-500' : 'border-gray-300'}
          border
        `}
        {...props}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
};
