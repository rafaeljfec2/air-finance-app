import { Logo } from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function HeaderV2() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl font-semibold text-[#10b981] border-2 border-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Entrar na aplicação"
        >
          Entrar
        </button>
      </div>
    </header>
  );
}
