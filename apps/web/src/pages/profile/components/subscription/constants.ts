import { Crown, Sparkles, Zap } from 'lucide-react';
import React from 'react';

export const PLAN_ACCENT: Record<
  string,
  { border: string; bg: string; text: string; icon: string }
> = {
  free: {
    border: 'border-gray-300 dark:border-gray-600',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    icon: 'text-gray-500 dark:text-gray-400',
  },
  starter: {
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  pro: {
    border: 'border-blue-400 dark:border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  business: {
    border: 'border-purple-400 dark:border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

export const PLAN_ICON: Record<string, React.ReactNode> = {
  free: React.createElement(Zap, { className: 'h-5 w-5' }),
  starter: React.createElement(Zap, { className: 'h-5 w-5' }),
  pro: React.createElement(Sparkles, { className: 'h-5 w-5' }),
  business: React.createElement(Crown, { className: 'h-5 w-5' }),
};

export const FALLBACK_OB_PRICE = 7.99;
