import { Logo } from '@/components/Logo';
import { MessageSquare, Headphones } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const footerLinks = {
  produto: [
    { name: 'Recursos', href: '#features' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Segurança', href: '#security' },
    { name: 'Integrações', href: '#' },
  ],
  empresa: [
    { name: 'Sobre nós', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Carreiras', href: '#' },
    { name: 'Contato', href: '#' },
  ],
  legal: [
    { name: 'Privacidade', href: '#' },
    { name: 'Termos', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'LGPD', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <ScrollReveal variant="fade">
            <div>
              <Logo className="mb-6" />
              <p className="text-text/60 mb-6">
                Simplificando suas finanças com tecnologia e segurança.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-text/60 hover:text-brand-arrow transition-colors"
                  aria-label="LinkedIn"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-text/60 hover:text-brand-arrow transition-colors"
                  aria-label="Suporte"
                >
                  <Headphones className="w-5 h-5" />
                </a>
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

          <ScrollReveal variant="fade" delay={0.3}>
            <div>
              <h5 className="font-semibold mb-6 text-brand-arrow">Legal</h5>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
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
        </div>
        <ScrollReveal variant="fade" delay={0.4}>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text/60">
            <p>© {new Date().getFullYear()} Airfinance. Todos os direitos reservados.</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}

