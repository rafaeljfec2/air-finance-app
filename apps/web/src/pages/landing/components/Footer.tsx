import { Logo } from '@/components/Logo';
import { MessageSquare, Headphones } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Link } from 'react-router-dom';

const footerLinks = {
  produto: [
    { name: 'Recursos', href: '#features' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Segurança', href: '#security' },
    { name: 'Integrações', href: '#' },
  ],
  conteudo: [
    { name: 'Gestão Financeira CPF', href: '/gestao-financeira-cpf' },
    {
      name: 'Controle Financeiro Pessoal',
      href: '/gestao-financeira-cpf/controle-financeiro-pessoal',
    },
    {
      name: 'Organização Financeira',
      href: '/gestao-financeira-cpf/organizacao-financeira-pessoal',
    },
    {
      name: 'Categorização Automática',
      href: '/gestao-financeira-cpf/categorizacao-automatica-gastos',
    },
    {
      name: 'Gestão Financeira com IA',
      href: '/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial',
    },
    { name: 'Score de Crédito', href: '/gestao-financeira-cpf/score-credito-e-financas-pessoais' },
  ],
  empresa: [
    { name: 'Sobre nós', href: '#' },
    { name: 'Carreiras', href: '#' },
    { name: 'Contato', href: '#' },
  ],
  legal: [
    { name: 'Privacidade', href: '/privacy' },
    { name: 'Termos', href: '/terms' },
    { name: 'Cookies', href: '/privacy' },
    { name: 'LGPD', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12">
          <ScrollReveal variant="fade">
            <div>
              <Logo className="mb-6" />
              <p className="text-text/60 mb-6">
                Simplificando suas finanças com tecnologia e segurança.
              </p>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-text/60 hover:text-brand-arrow transition-colors"
                  aria-label="LinkedIn"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-text/60 hover:text-brand-arrow transition-colors"
                  aria-label="Suporte"
                >
                  <Headphones className="w-5 h-5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade" delay={0.1}>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Produto</h5>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-text/60 hover:text-brand-arrow transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade" delay={0.2}>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Conteúdo</h5>
              <ul className="space-y-3">
                {footerLinks.conteudo.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-text/60 hover:text-brand-arrow transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade" delay={0.3}>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Empresa</h5>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-text/60 hover:text-brand-arrow transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade" delay={0.4}>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Legal</h5>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-text/60 hover:text-brand-arrow transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-text/60 hover:text-brand-arrow transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal variant="fade" delay={0.5}>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text/60 space-y-2">
            <p>© {new Date().getFullYear()} Airfinance. Todos os direitos reservados.</p>
            <p>
              Desenvolvido por{' '}
              <a
                href="https://www.connexto.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-arrow hover:underline dark:text-brand-leaf"
              >
                Connexto Tecnologia Ltda
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
