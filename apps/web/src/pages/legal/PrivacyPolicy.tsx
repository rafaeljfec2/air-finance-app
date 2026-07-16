import { PublicDarkLayout } from '@/components/seo/PublicDarkLayout';
import { usePageScroll } from '@/hooks/usePageScroll';

export function PrivacyPolicy() {
  usePageScroll();

  return (
    <PublicDarkLayout>
      <main className="mx-auto w-full max-w-4xl flex-grow px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-lg md:p-12">
          <h1 className="mb-8 text-3xl font-bold text-gray-50">Política de Privacidade</h1>

          <div className="space-y-6 text-gray-300">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">1. Coleta de Informações</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados
                financeiros inseridos na plataforma. Também podemos coletar dados automaticamente,
                como endereço IP e tipo de navegador.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">2. Uso das Informações</h2>
              <p>
                Usamos suas informações para fornecer, manter e melhorar nossos serviços, processar
                transações, enviar notificações e responder a solicitações de suporte.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">
                3. Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores
                de serviços terceirizados que nos ajudam a operar nossa plataforma, sempre sob
                rigorosos acordos de confidencialidade.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">4. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas
                informações contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">5. Seus Direitos</h2>
              <p>
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você
                também pode optar por não receber comunicações de marketing a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">6. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar
                tendências e administrar o site.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">
                7. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Recomendamos revisar
                esta página regularmente para quaisquer alterações.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">8. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco
                através do nosso suporte.
              </p>
            </section>
          </div>
        </div>
      </main>
    </PublicDarkLayout>
  );
}
