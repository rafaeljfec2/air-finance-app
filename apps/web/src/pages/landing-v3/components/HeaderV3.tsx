import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Logo } from '@/components/Logo';

import { FadePresence, V3_EASE } from './animations';

const NAV_ITEMS = [
  { label: 'Check-up', hash: '#checkup-pillars' },
  { label: 'Experiência', hash: '#dashboard-preview' },
  { label: 'Preços', hash: '#pricing' },
] as const;

export function HeaderV3() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduced = useReducedMotion() === true;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'bg-[#0b1120]/95 backdrop-blur-lg border-b border-gray-800 shadow-sm'
          : 'bg-[#0b1120]/80 backdrop-blur-md border-b border-transparent'
      }`}
      initial={reduced ? { opacity: 0 } : { y: -16, opacity: 0 }}
      animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={reduced ? { duration: 0.01 } : { duration: 0.45, ease: V3_EASE }}
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
          <Logo variant="white" />
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
              className="px-3 py-2 text-gray-400 hover:text-gray-50 transition-colors duration-200 font-medium text-sm rounded-lg hover:bg-white/5"
            >
              {item.label}
            </a>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="v3-btn-ghost"
              aria-label="Entrar na aplicação"
            >
              Entrar
            </button>
            <button
              type="button"
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
            type="button"
            onClick={() => navigate('/register')}
            className="v3-btn-primary !px-4 !py-2 !text-sm"
            aria-label="Criar conta grátis"
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-gray-50 transition-colors"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <FadePresence
        show={mobileMenuOpen}
        className="md:hidden bg-[#111827] border-t border-gray-800 shadow-lg"
      >
        <div className="v3-container py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.hash}
              href={item.hash}
              onClick={(e) => handleNavClick(e, item.hash)}
              className="px-4 py-3 text-gray-300 hover:text-gray-50 hover:bg-white/5 transition-colors font-medium text-sm rounded-lg"
            >
              {item.label}
            </a>
          ))}
          <hr className="v3-divider my-2" />
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
            className="px-4 py-3 text-gray-300 hover:text-gray-50 hover:bg-white/5 transition-colors font-medium text-sm rounded-lg text-left"
          >
            Entrar
          </button>
        </div>
      </FadePresence>
    </motion.header>
  );
}
