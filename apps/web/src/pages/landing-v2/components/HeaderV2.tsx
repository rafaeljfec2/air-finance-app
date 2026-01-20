import { Logo } from '@/components/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export function HeaderV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // Small timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-lg border-b border-gray-200 shadow-md'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100/50 shadow-sm'
      }`}
      style={{ position: 'fixed' }}
    >
      <div className="v2-container flex items-center justify-between h-20">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 focus:outline-none"
          aria-label="Ir para a página inicial"
        >
          <Logo />
        </button>
        <nav
          className="hidden md:flex items-center space-x-6 lg:space-x-8"
          role="navigation"
          aria-label="Navegação principal"
        >
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            className="text-gray-700 hover:text-[#10b981] transition-colors font-medium text-sm lg:text-base"
            aria-label="Ir para seção de Recursos"
          >
            Recursos
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleNavClick(e, '#pricing')}
            className="text-gray-700 hover:text-[#10b981] transition-colors font-medium text-sm lg:text-base"
            aria-label="Ir para seção de Planos"
          >
            Planos
          </a>
          <button
            onClick={() => navigate('/login')}
            className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-semibold text-[#10b981] border-2 border-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 text-sm lg:text-base"
            aria-label="Entrar na aplicação"
          >
            Entrar
          </button>
        </nav>
        {/* Mobile menu button - show only on mobile */}
        <button
          onClick={() => navigate('/login')}
          className="md:hidden px-4 py-2 rounded-xl font-semibold text-[#10b981] border-2 border-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-300 text-sm"
          aria-label="Entrar na aplicação"
        >
          Entrar
        </button>
      </div>
    </header>
  );
}
