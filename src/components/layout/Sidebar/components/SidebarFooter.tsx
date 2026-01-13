import { useSidebarStore } from '@/stores/sidebar';
import { cn } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight, ExternalLink } from 'lucide-react';

export function SidebarFooter() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <div className="p-4 pt-2 border-t border-border dark:border-border-dark space-y-3">
      {/* Reddit Link */}
      <a
        href="https://www.reddit.com/r/airfinance_app/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center justify-center w-full px-2 py-2 text-sm font-medium rounded-md text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors',
        )}
        title="Comunidade"
      >
        <ExternalLink className="h-5 w-5" />
        {!isCollapsed && <span className="ml-3">Comunidade</span>}
      </a>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={cn(
          'flex items-center justify-center w-full p-2 text-sm font-medium rounded-md',
          'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
          'transition-colors duration-200',
        )}
      >
        {isCollapsed ? (
          <ChevronsRight className="h-5 w-5" />
        ) : (
          <>
            <ChevronsLeft className="h-5 w-5" />
            <span className="ml-2">Recolher</span>
          </>
        )}
      </button>
    </div>
  );
}
