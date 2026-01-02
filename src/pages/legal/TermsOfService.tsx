import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';
import { usePageScroll } from '@/hooks/usePageScroll';

export function TermsOfService() {
  usePageScroll();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Serviço</h1>

          <div className="space-y-6 text-gray-600">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma AirFinance, você concorda em cumprir e estar
                vinculado aos seguintes termos e condições de uso. Se você não concordar com
                qualquer parte destes termos, não deverá usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Descrição do Serviço</h2>
              <p>
                A AirFinance fornece ferramentas de gestão financeira pessoal e empresarial.
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do
                serviço a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Conta do Usuário</h2>
              <p>
                Para acessar certas funcionalidades, você deve criar uma conta. Você é responsável
                por manter a confidencialidade de suas credenciais e por todas as atividades que
                ocorrem sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Privacidade</h2>
              <p>
                Sua privacidade é importante para nós. As informações coletadas estão sujeitas à
                nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                5. Limitação de Responsabilidade
              </h2>
              <p>
                A AirFinance não será responsável por quaisquer danos indiretos, incidentais,
                especiais, consequenciais ou punitivos resultantes do uso ou da incapacidade de usar
                o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Alterações nos Termos</h2>
              <p>
                Podemos atualizar estes Termos de Serviço periodicamente. Notificaremos sobre
                quaisquer alterações significativas publicando os novos termos nesta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos, entre em contato conosco através do nosso
                suporte.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
