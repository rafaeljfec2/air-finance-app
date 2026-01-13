import { Logo } from '@/components/Logo';
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
        <HeaderMobileButtons
          onOpenSidebar={onOpenSidebar}
          showBackButton={shouldShowBackButton}
          onBack={goBack}
        />

        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Ações do Header */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Company Selector */}
          <div className="hidden lg:block">
            <CompanySelector />
          </div>

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
