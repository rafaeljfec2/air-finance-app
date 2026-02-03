import { Logo } from '@/components/Logo';
import { MessageSquare, Headphones } from 'lucide-react';
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
    { name: 'Contato', href: '#contact' },
  ],
  legal: [
    { name: 'Privacidade', href: '/privacy' },
    { name: 'Termos', href: '/terms' },
    { name: 'Cookies', href: '/privacy' },
    { name: 'LGPD', href: '/privacy' },
  ],
};

export function FooterV2() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="v2-container">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Logo and Branding */}
          <div>
            <Logo className="mb-6" />
            <p className="text-gray-600 mb-6 leading-relaxed">
              Simplificando suas finanças com tecnologia e segurança.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                className="text-gray-600 hover:text-[#10b981] transition-colors"
                aria-label="Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-[#10b981] transition-colors"
                aria-label="Suporte"
              >
                <Headphones className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h5 className="font-semibold mb-6 text-[#10b981]">Produto</h5>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-[#10b981] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Conteúdo */}
          <div>
            <h5 className="font-semibold mb-6 text-[#10b981]">Conteúdo</h5>
            <ul className="space-y-3">
              {footerLinks.conteudo.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-[#10b981] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h5 className="font-semibold mb-6 text-[#10b981]">Empresa</h5>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-[#10b981] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold mb-6 text-[#10b981]">Legal</h5>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-[#10b981] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-[#10b981] transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-12 border-t border-gray-100 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Airfinance. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Desenvolvido por{' '}
            <a
              href="https://www.connexto.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#10b981] hover:underline"
            >
              Connexto Tecnologia Ltda
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
