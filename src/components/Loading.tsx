import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/stores/useTheme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'large', color }) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
      <ActivityIndicator size={size} color={color || (isDarkMode ? '#8b5cf6' : '#6d28d9')} />
    </View>
  );
};
