import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TransactionTypeModal } from '@/components/transactions/TransactionTypeModal';
import { CompanySelectionModal } from '@/features/company/components/CompanySelectionModal';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import { useSidebarStore } from '@/stores/sidebar';
import { Eye } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';

interface ViewDefaultProps {
  children: ReactNode;
}

export function ViewDefault({ children }: Readonly<ViewDefaultProps>) {
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
      {isHeaderVisible && <Header onOpenSidebar={handleOpenSidebar} />}
      <CompanySelectionModal />
      <TransactionTypeModal isOpen={isFabModalOpen} onClose={() => setIsFabModalOpen(false)} />

      {/* Botão flutuante para mostrar header quando estiver escondido */}
      {!isHeaderVisible && (
        <div className="fixed top-safe-4 right-safe-4 z-50">
          <button
            onClick={toggleHeaderVisibility}
            className="p-3 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform active:scale-95 flex items-center justify-center"
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
          isHeaderVisible
            ? 'h-[calc(100dvh-4rem)]'
            : 'h-[100dvh]',
        )}
      >
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} isHeaderVisible={isHeaderVisible} />
        <main
          className={cn(
            'flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300 w-full',
            // Mobile: padding bottom considers safe area + bottom nav space (5rem)
            'pb-20 lg:pb-6',
            isCollapsed ? 'lg:pl-6' : 'lg:pl-8',
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onNewTransaction={() => setIsFabModalOpen(true)} 
        onMenuOpen={handleOpenSidebar}
      />
    </div>
  );
}
