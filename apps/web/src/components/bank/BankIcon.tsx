import { useState } from 'react';
import type React from 'react';
import * as Icons from 'lucide-react';
import { getBankInfo } from '@/utils/bankIcons';
import { cn } from '@/lib/utils';

export interface BankIconProps {
  bankCode?: string;
  institution?: string;
  iconName?: string; // Override icon name for custom accounts
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: boolean;
  fillContainer?: boolean; // Se true, o logo ocupa 100% do container
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const IMG_SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

// Classes para quando o logo deve ocupar o container inteiro
const IMG_FULL_CONTAINER_CLASSES = {
  sm: 'h-full w-full',
  md: 'h-full w-full',
  lg: 'h-full w-full',
  xl: 'h-full w-full',
};

/**
 * BankIcon Component
 * 
 * Displays bank logo (SVG/PNG) if available, otherwise falls back to lucide-react icon
 * 
 * @param bankCode - Bank code (e.g., '001', '237')
 * @param institution - Institution name (e.g., 'Banco do Brasil')
 * @param iconName - Optional custom icon name for non-bank accounts
 * @param size - Icon size: sm, md, lg, xl
 * @param className - Additional CSS classes
 * @param rounded - Whether to apply rounded corners (useful for logos)
 */
export function BankIcon({
  bankCode,
  institution,
  iconName,
  size = 'md',
  className,
  rounded = true,
  fillContainer = false,
}: Readonly<BankIconProps>) {
  const [logoError, setLogoError] = useState(false);

  // Get bank information first (prioritize bank logo over custom icon)
  const bankInfo = getBankInfo(bankCode, institution);

  // Try to render logo if available and no error occurred (priority over iconName)
  // Check if logoPath is a string (URL) - Vite processes SVGs as URLs when used in img src
  if (bankInfo.hasLogo && bankInfo.logoPath && !logoError) {
    const logoUrl = typeof bankInfo.logoPath === 'string' ? bankInfo.logoPath : String(bankInfo.logoPath);
    
    return (
      <img
        src={logoUrl}
        alt={institution || `Bank ${bankCode}`}
        className={cn(
          fillContainer ? IMG_FULL_CONTAINER_CLASSES[size] : IMG_SIZE_CLASSES[size],
          rounded && 'rounded',
          fillContainer ? 'object-cover' : 'object-contain',
          className,
        )}
        onError={() => setLogoError(true)}
        loading="lazy"
      />
    );
  }

  // If custom iconName is provided and no logo available, use it
  if (iconName) {
    const Icon =
      (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName] ||
      Icons.Banknote;
    return <Icon className={cn(SIZE_CLASSES[size], className)} />;
  }

  // Fallback to bank-specific lucide-react icon
  const FallbackIcon =
    (Icons as Record<string, React.ComponentType<{ className?: string }>>)[bankInfo.iconName] ||
    Icons.Banknote;
  return <FallbackIcon className={cn(SIZE_CLASSES[size], className)} />;
}
