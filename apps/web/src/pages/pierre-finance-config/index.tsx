import { ArrowLeft, Check, ExternalLink, Key, Link2, Settings, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/pages/landing/components/SEOHead';

export function PierreFinanceConfigPage() {
  useEffect(() => {
    // Enable scroll on page
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = 'auto';
    htmlElement.style.height = 'auto';
    bodyElement.style.overflow = 'auto';
    bodyElement.style.height = 'auto';

    return () => {
      // Restore original styles on unmount
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
    };
  }, []);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar para a página inicial</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <Link2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como configurar o Pierre Finance
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Guia passo a passo para obter sua API Key e conectar suas contas bancárias via Open
              Finance
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que é o Pierre Finance?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O Pierre Finance é um agregador de contas bancárias via Open Finance que permite
              conectar e gerenciar múltiplas contas bancárias em um único lugar. Com ele, você pode:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Conectar até 5 bancos simultaneamente (plano Pro)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Visualizar saldos e transações em tempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Importar automaticamente suas contas para o Air Finance</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Manter seus dados seguros com criptografia de ponta a ponta</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> O Pierre Finance Pro custa R$ 39/mês e é pago
                diretamente ao Pierre Finance. Este é um custo adicional ao plano Pro do Air Finance.
              </p>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Acesse o Pierre Finance e faça login
                  </h2>
                  <p className="text-gray-600">
                    Primeiro, você precisa ter uma conta no Pierre Finance. Se ainda não tem, crie
                    uma conta gratuitamente.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <a
                  href="https://pierre.finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Acessar Pierre Finance
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Navegue até a seção de API Keys
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Após fazer login, você precisa acessar a área de configurações para gerenciar
                    suas API Keys.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-2">Como encontrar:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      <li>Clique no menu lateral esquerdo (ícone de três linhas ou seu nome)</li>
                      <li>Procure por "Minha Conta" ou "Configurações"</li>
                      <li>Na página de configurações, você verá várias abas no topo</li>
                      <li>Clique na aba <strong>"API Keys"</strong></li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Localização da API Keys
                    </p>
                    <p className="text-sm text-blue-700">
                      A seção de API Keys está localizada em: <strong>Minha Conta → API Keys</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Visualize ou crie sua API Key
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Na página de API Keys, você pode visualizar sua chave padrão ou criar uma nova.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Option A: View Default Key */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Opção A: Visualizar API Key Padrão
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Se você já tem uma API Key padrão, você pode visualizá-la diretamente:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Clique no link "Ver minha API key padrão →"</li>
                    <li>Clique no ícone de olho para revelar a chave</li>
                    <li>Clique no ícone de copiar para copiar a chave completa</li>
                  </ol>
                </div>

                {/* Option B: Create New Key */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    Opção B: Criar uma Nova API Key
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Para criar uma nova API Key personalizada:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>No campo "Nome da API key", digite um nome descritivo (ex: "Air Finance Production")</li>
                    <li>Clique no botão "+ Criar"</li>
                    <li>Após criar, clique no ícone de olho para revelar a chave</li>
                    <li>Clique no ícone de copiar para copiar a chave completa</li>
                  </ol>
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      <strong>Dica:</strong> A API Key sempre começa com "sk-" seguido de caracteres
                      alfanuméricos. Certifique-se de copiar a chave completa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Configure no Air Finance
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Agora que você tem sua API Key, é hora de configurá-la no Air Finance.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>
                      <strong>Faça login no Air Finance</strong> e acesse a página de Contas
                      Bancárias
                    </li>
                    <li>
                      Clique no botão <strong>"Conectar com Pierre Finance"</strong> (geralmente
                      localizado no topo da página)
                    </li>
                    <li>
                      No modal que abrir, você verá instruções sobre como obter a API Key
                    </li>
                    <li>
                      Cole sua API Key no campo <strong>"API Key do Pierre Finance"</strong>
                    </li>
                    <li>
                      Clique em <strong>"Conectar com Pierre Finance"</strong>
                    </li>
                    <li>
                      Aguarde a conexão ser estabelecida. Você verá uma mensagem de sucesso
                    </li>
                    <li>
                      Selecione as contas bancárias que deseja importar para o Air Finance
                    </li>
                    <li>
                      Clique em <strong>"Importar"</strong> para finalizar
                    </li>
                  </ol>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Pronto! Suas contas estão conectadas
                      </p>
                      <p className="text-sm text-green-700">
                        Após a importação, suas contas bancárias aparecerão automaticamente no Air
                        Finance e você poderá gerenciá-las normalmente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-yellow-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
              <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
                <Key className="w-6 h-6" />
                Segurança da sua API Key
              </h2>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Sua API Key nunca é armazenada no nosso sistema</strong> - ela é usada
                    apenas para estabelecer a conexão
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Nunca compartilhe sua API Key com terceiros ou a publique em locais públicos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Se você suspeitar que sua API Key foi comprometida, desabilite-a no Pierre
                    Finance e crie uma nova
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Você pode gerenciar múltiplas API Keys no Pierre Finance para diferentes
                    integrações
                  </span>
                </li>
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Problemas Comuns</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    A API Key não está funcionando
                  </h3>
                  <p className="text-sm text-gray-600">
                    Verifique se você copiou a chave completa, incluindo o prefixo "sk-". Certifique-se
                    de que não há espaços antes ou depois da chave.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Não consigo encontrar a seção de API Keys
                  </h3>
                  <p className="text-sm text-gray-600">
                    Certifique-se de que você está logado no Pierre Finance e que tem uma assinatura
                    ativa (Pierre Pro ou Premium). A funcionalidade de API Keys está disponível para
                    assinantes.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    A conexão está demorando muito
                  </h3>
                  <p className="text-sm text-gray-600">
                    A primeira conexão pode levar alguns minutos. Se demorar mais de 5 minutos, tente
                    desconectar e reconectar. Verifique também sua conexão com a internet.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-blue-100 mb-6">
                Siga os passos acima e conecte suas contas bancárias em minutos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Criar conta no Air Finance
                </Link>
                <a
                  href="https://pierre.finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Acessar Pierre Finance
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
