import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';

const stats = [
  { icon: Users, value: '10k+', label: 'Usuários ativos' },
  { icon: TrendingUp, value: 'R$ 50M+', label: 'Gerenciados' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-arrow/10 via-brand-arrow/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto">
        <ScrollReveal variant="fade">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-arrow">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl text-text/80 max-w-2xl mx-auto mb-8">
              Junte-se a milhares de pessoas que já estão no controle das suas finanças
            </p>
            <Button
              size="lg"
              className="group bg-brand-arrow hover:bg-brand-arrow/90 text-white px-10 py-7 text-lg inline-flex items-center gap-2 glow-effect transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2"
              onClick={() => navigate('/login')}
              aria-label="Começar a usar o Airfinance gratuitamente"
            >
              Começar gratuitamente
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideUp" delay={0.3}>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-xl bg-brand-arrow/10 mb-4">
                    <Icon className="w-8 h-8 text-brand-arrow" />
                  </div>
                  <p className="text-4xl font-bold text-brand-arrow mb-2">{stat.value}</p>
                  <p className="text-text/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

