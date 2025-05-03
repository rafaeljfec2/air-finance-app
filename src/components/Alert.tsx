import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/stores/useTheme';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message }) => {
  const { isDarkMode } = useTheme();

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-l-green-500',
          text: 'text-green-700 dark:text-green-400',
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-l-red-500',
          text: 'text-red-700 dark:text-red-400',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-l-yellow-500',
          text: 'text-yellow-700 dark:text-yellow-400',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-l-blue-500',
          text: 'text-blue-700 dark:text-blue-400',
        };
    }
  };

  const classes = getTypeClasses();

  return (
    <View className={`p-4 rounded-lg ${classes.bg} ${classes.border} border-l-4 mb-4`}>
      <Text className={`text-sm ${classes.text}`}>{message}</Text>
    </View>
  );
};
