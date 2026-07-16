import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/Logo';

const FOOTER_LINKS = {
  produto: [
    { name: 'Check-up', href: '/#checkup-pillars' },
    { name: 'Experiência', href: '/#dashboard-preview' },
    { name: 'Preços', href: '/#pricing' },
  ],
  conteudo: [
    { name: 'Gestão Financeira CPF', href: '/gestao-financeira-cpf', isRoute: true },
    {
      name: 'Controle Financeiro Pessoal',
      href: '/gestao-financeira-cpf/controle-financeiro-pessoal',
      isRoute: true,
    },
    {
      name: 'Categorização Automática',
      href: '/gestao-financeira-cpf/categorizacao-automatica-gastos',
      isRoute: true,
    },
  ],
  legal: [
    { name: 'Privacidade', href: '/privacy', isRoute: true },
    { name: 'Termos', href: '/terms', isRoute: true },
    { name: 'LGPD', href: '/privacy', isRoute: true },
  ],
} as const;

export function FooterV3() {
  return (
    <footer className="bg-[var(--v3-bg-alt)] border-t border-gray-800 py-12 md:py-16">
      <div className="v3-container">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Logo className="mb-4" variant="white" />
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Companheiro da evolução financeira — clareza de capacidade para melhores decisões.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-gray-500 font-medium">Conforme LGPD</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-50 mb-4">Produto</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.produto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-50 mb-4">Conteúdo</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.conteudo.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-50 mb-4">Legal</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Airfinance. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Desenvolvido por{' '}
            <a
              href="https://www.connexto.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Connexto Tecnologia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
