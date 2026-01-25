import { CompanySelector } from '@/components/layout/CompanySelector';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  readonly onClose?: () => void;
  readonly isHeaderVisible: boolean;
}

export function SidebarHeader({ onClose, isHeaderVisible }: Readonly<SidebarHeaderProps>) {
  const { isCollapsed } = useSidebarStore();
  const showCompanySelector = !isCollapsed;
  const showCloseButton = !!onClose;

  if (!showCompanySelector && !showCloseButton) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        showCompanySelector && 'px-2 py-3 pt-safe lg:pt-3',
        !showCompanySelector && showCloseButton && 'p-4 pt-safe lg:pt-4',
      )}
    >
      {showCompanySelector && (
        <div
          className={cn(
            'w-full',
            isHeaderVisible && 'lg:hidden',
          )}
        >
          <CompanySelector size="large" />
        </div>
      )}
      {showCloseButton && (
        <button
          className="absolute top-safe-4 right-safe-4 lg:top-4 lg:right-4 lg:hidden min-h-[44px] min-w-[44px] p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center z-10"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
