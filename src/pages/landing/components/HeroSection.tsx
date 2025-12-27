import heroImage from '@/assets/images/landing/hero.svg';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParallax } from '../hooks/useParallax';

export function HeroSection() {
  const navigate = useNavigate();
  const { parallaxY } = useParallax({ speed: 0.3 });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-arrow/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-brand-arrow leading-tight"
              aria-label="Transforme sua vida financeira com inteligência"
            >
              Transforme sua vida
              <br />
              <span className="bg-gradient-to-r from-brand-arrow to-brand-arrow/60 bg-clip-text text-transparent">
                financeira com inteligência
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 text-text/80 leading-relaxed"
            >
              O Airfinance revoluciona a forma como você gerencia seu dinheiro, oferecendo insights
              poderosos e uma experiência única de controle financeiro.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                className="group bg-brand-arrow hover:bg-brand-arrow/90 text-white px-8 py-6 text-lg inline-flex items-center gap-2 glow-effect transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2"
                onClick={() => navigate('/register')}
                aria-label="Começar a usar o Airfinance gratuitamente"
              >
                Comece gratuitamente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-brand-arrow text-brand-arrow hover:bg-brand-arrow/10 px-8 py-6 text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Ver demonstração dos recursos"
              >
                Ver demonstração
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:block relative z-10"
            style={{ transform: `translateY(${parallaxY * 0.5}px)` }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-arrow/20 to-transparent rounded-2xl blur-3xl" />
              <img
                src={heroImage}
                alt="Dashboard do Airfinance mostrando gráficos e análises financeiras"
                className="w-full h-auto relative z-10 rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
