import { useState } from 'react';
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
}: Readonly<BankIconProps>) {
  const [logoError, setLogoError] = useState(false);

  // If custom iconName is provided, use it directly
  if (iconName) {
    const Icon = (Icons as any)[iconName] || Icons.Banknote;
    return <Icon className={cn(SIZE_CLASSES[size], className)} />;
  }

  // Get bank information
  const bankInfo = getBankInfo(bankCode, institution);

  // Try to render logo if available and no error occurred
  if (bankInfo.hasLogo && bankInfo.logoPath && !logoError) {
    return (
      <img
        src={bankInfo.logoPath}
        alt={institution || `Bank ${bankCode}`}
        className={cn(
          IMG_SIZE_CLASSES[size],
          rounded && 'rounded',
          'object-contain',
          className,
        )}
        onError={() => setLogoError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to lucide-react icon
  const FallbackIcon = (Icons as any)[bankInfo.iconName] || Icons.Banknote;
  return <FallbackIcon className={cn(SIZE_CLASSES[size], className)} />;
}
