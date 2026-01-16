import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';
import { usePageScroll } from '@/hooks/usePageScroll';

export function PrivacyPolicy() {
  usePageScroll();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>

          <div className="space-y-6 text-gray-600">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Coleta de Informações</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados
                financeiros inseridos na plataforma. Também podemos coletar dados automaticamente,
                como endereço IP e tipo de navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Uso das Informações</h2>
              <p>
                Usamos suas informações para fornecer, manter e melhorar nossos serviços, processar
                transações, enviar notificações e responder a solicitações de suporte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                3. Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores
                de serviços terceirizados que nos ajudam a operar nossa plataforma, sempre sob
                rigorosos acordos de confidencialidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas
                informações contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você
                também pode optar por não receber comunicações de marketing a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar
                tendências e administrar o site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                7. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Recomendamos revisar
                esta página regularmente para quaisquer alterações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco
                através do nosso suporte.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
