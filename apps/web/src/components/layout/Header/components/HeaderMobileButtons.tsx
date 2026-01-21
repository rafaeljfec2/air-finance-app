import React from 'react';
import { ArrowLeft, Menu as MenuIcon } from 'lucide-react';

interface HeaderMobileButtonsProps {
  onOpenSidebar?: () => void;
  showBackButton: boolean;
  onBack: () => void;
}

export function HeaderMobileButtons({
  onOpenSidebar,
  showBackButton,
  onBack,
}: Readonly<HeaderMobileButtonsProps>) {
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="flex items-center">
      {/* Back Button - Alinhado à esquerda quando visível */}
      {showBackButton && (
        <button
          type="button"
          onClick={handleBackClick}
          className="lg:hidden mr-2 min-h-[44px] min-w-[44px] p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-6 w-6 pointer-events-none" />
        </button>
      )}

      {/* Botão hambúrguer mobile */}
      <button
        type="button"
        className="lg:hidden mr-2 min-h-[44px] min-w-[44px] p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
        onClick={onOpenSidebar}
        aria-label="Abrir menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
