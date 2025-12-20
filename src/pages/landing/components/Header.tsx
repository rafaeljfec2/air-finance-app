import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-white/80 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Logo />
        <nav
          className="hidden md:flex items-center space-x-8"
          role="navigation"
          aria-label="Navegação principal"
        >
          <a
            href="#features"
            className="text-text/80 hover:text-brand-arrow transition-colors"
            aria-label="Ir para seção de Recursos"
          >
            Recursos
          </a>
          <a
            href="#security"
            className="text-text/80 hover:text-brand-arrow transition-colors"
            aria-label="Ir para seção de Segurança"
          >
            Segurança
          </a>
          <a
            href="#pricing"
            className="text-text/80 hover:text-brand-arrow transition-colors"
            aria-label="Ir para seção de Planos"
          >
            Planos
          </a>
          <Button
            variant="outline"
            className="border-brand-arrow text-brand-arrow bg-transparent hover:bg-brand-arrow/5 dark:hover:bg-brand-arrow/10 transition-colors px-6"
            onClick={() => navigate('/signup')}
          >
            Criar conta
          </Button>
          <Button
            variant="default"
            className="bg-brand-arrow hover:bg-brand-arrow/90 text-white px-6"
            onClick={() => navigate('/login')}
          >
            Entrar
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}

