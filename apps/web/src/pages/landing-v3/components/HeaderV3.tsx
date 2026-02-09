import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Recursos', hash: '#features' },
  { label: 'Preços', hash: '#pricing' },
  { label: 'Como funciona', hash: '#how-it-works' },
] as const;

export function HeaderV3() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/' || location.pathname === '/landing-v3') {
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/landing-v3');
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm'
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="v3-container flex items-center justify-between h-16">
        <button
          type="button"
          onClick={() => {
            navigate('/landing-v3');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 focus:outline-none"
          aria-label="Ir para a página inicial"
        >
          <Logo />
        </button>

        <nav
          className="hidden md:flex items-center gap-1"
          role="navigation"
          aria-label="Navegação principal"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.hash}
              href={item.hash}
              onClick={(e) => handleNavClick(e, item.hash)}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm rounded-lg hover:bg-gray-50"
            >
              {item.label}
            </a>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => navigate('/login')}
              className="v3-btn-ghost"
              aria-label="Entrar na aplicação"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/register')}
              className="v3-btn-primary"
              aria-label="Criar conta grátis"
            >
              Criar conta grátis
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => navigate('/register')}
            className="v3-btn-primary !px-4 !py-2 !text-sm"
            aria-label="Criar conta grátis"
          >
            Criar conta
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="v3-container py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                onClick={(e) => handleNavClick(e, item.hash)}
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium text-sm rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <hr className="v3-divider my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium text-sm rounded-lg text-left"
            >
              Entrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
