import { Eye } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';

import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { CompanySelectionModal } from '@/features/company/components/CompanySelectionModal';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import { useSidebarStore } from '@/stores/sidebar';

interface ViewDefaultProps {
  readonly children: ReactNode;
  readonly immersiveDesktop?: boolean;
}

export function ViewDefault({ children, immersiveDesktop = false }: Readonly<ViewDefaultProps>) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isHeaderVisible = usePreferencesStore((state) => state.isHeaderVisible);
  const toggleHeaderVisibility = usePreferencesStore((state) => state.toggleHeaderVisibility);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFabModalOpen, setIsFabModalOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark relative">
      {isHeaderVisible && (
        <div className={cn(immersiveDesktop && 'lg:hidden')}>
          <Header onOpenSidebar={handleOpenSidebar} />
        </div>
      )}
      <CompanySelectionModal />
      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />

      {!isHeaderVisible && (
        <div className="fixed top-safe-4 right-safe-4 z-50">
          <button
            onClick={toggleHeaderVisibility}
            className="flex items-center justify-center rounded-full bg-primary-600 p-3 text-white shadow-xl transition-transform hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95"
            aria-label="Mostrar Header"
            title="Mostrar Header"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      )}

      <div
        className={cn(
          'flex transition-all duration-300',
          isHeaderVisible ? 'h-[calc(100dvh-4rem)]' : 'h-[100dvh]',
          immersiveDesktop && 'lg:h-[100dvh]',
        )}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isHeaderVisible={isHeaderVisible && !immersiveDesktop}
        />
        <main
          className={cn(
            'w-full flex-1 overflow-auto p-4 transition-all duration-300 sm:p-6',
            'pb-20 lg:pb-6',
            isCollapsed ? 'lg:pl-6' : 'lg:pl-8',
          )}
        >
          {children}
        </main>
      </div>

      <MobileBottomNav onNewTransaction={() => setIsFabModalOpen(true)} />
    </div>
  );
}
