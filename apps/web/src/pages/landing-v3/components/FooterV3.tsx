import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const FOOTER_LINKS = {
  produto: [
    { name: 'Recursos', href: '#features' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Como funciona', href: '#how-it-works' },
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
    <footer className="bg-gray-50 border-t border-gray-200 py-12 md:py-16">
      <div className="v3-container">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Gestão financeira com Open Finance e IA. Simples, seguro e automático.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-400 font-medium">Conforme LGPD</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4">Produto</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.produto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4">Conteúdo</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.conteudo.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-4">Legal</h5>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Airfinance. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400">
            Desenvolvido por{' '}
            <a
              href="https://www.connexto.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              Connexto Tecnologia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
