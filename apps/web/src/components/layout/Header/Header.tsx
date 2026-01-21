import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';
import { SupportModal } from '@/components/support/SupportModal';
import { CompanySelector } from '../CompanySelector';
import { HeaderMobileButtons } from './components/HeaderMobileButtons';
import { HeaderQuickActions } from './components/HeaderQuickActions';
import { HeaderThemeToggle } from './components/HeaderThemeToggle';
import { UserMenu } from './components/UserMenu';
import { useHeaderActions } from './hooks/useHeaderActions';
import { useHeaderNavigation } from './hooks/useHeaderNavigation';

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: Readonly<HeaderProps>) {
  const { shouldShowBackButton, goBack, navigateTo } = useHeaderNavigation();
  const {
    handleLogout,
    toggleTheme,
    isDarkMode,
    toggleHeaderVisibility,
    isHeaderVisible,
    isSupportOpen,
    openSupport,
    closeSupport,
  } = useHeaderActions();

  return (
    <header className="bg-card dark:bg-card-dark border-b border-border dark:border-border-dark shadow-sm z-20 relative">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left side: Mobile buttons (with back button) + Company Selector (web only) */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <HeaderMobileButtons
            onOpenSidebar={onOpenSidebar}
            showBackButton={shouldShowBackButton}
            onBack={goBack}
          />

          {/* Company Selector - Alinhado à esquerda na view web (sem botão de voltar) */}
          <div className="hidden lg:flex flex-shrink-0 min-w-[200px] max-w-[300px] items-center justify-start">
            <CompanySelector size="compact" />
          </div>
        </div>

        {/* Right side: Ações do Header */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
          {/* Atalhos Rápidos */}
          <HeaderQuickActions onNavigate={navigateTo} />

          {/* Botão de Tema */}
          <HeaderThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />

          {/* Notificações */}
          <NotificationsMenu />

          {/* Menu do Usuário */}
          <UserMenu
            onNavigate={navigateTo}
            onLogout={handleLogout}
            isHeaderVisible={isHeaderVisible}
            onToggleHeaderVisibility={toggleHeaderVisibility}
            onOpenSupport={openSupport}
          />
        </div>
      </div>
      <SupportModal isOpen={isSupportOpen} onClose={closeSupport} />
    </header>
  );
}
