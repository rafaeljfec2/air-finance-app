import { PublicDarkLayout } from '@/components/seo/PublicDarkLayout';
import { usePageScroll } from '@/hooks/usePageScroll';

export function TermsOfService() {
  usePageScroll();

  return (
    <PublicDarkLayout>
      <main className="mx-auto w-full max-w-4xl flex-grow px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-800 bg-[#111827] p-8 shadow-lg md:p-12">
          <h1 className="mb-8 text-3xl font-bold text-gray-50">Termos de Serviço</h1>

          <div className="space-y-6 text-gray-300">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma AirFinance, você concorda em cumprir e estar
                vinculado aos seguintes termos e condições de uso. Se você não concordar com
                qualquer parte destes termos, não deverá usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">2. Descrição do Serviço</h2>
              <p>
                A AirFinance fornece ferramentas de gestão financeira pessoal e empresarial.
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do
                serviço a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">3. Conta do Usuário</h2>
              <p>
                Para acessar certas funcionalidades, você deve criar uma conta. Você é responsável
                por manter a confidencialidade de suas credenciais e por todas as atividades que
                ocorrem sob sua conta.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">4. Privacidade</h2>
              <p>
                Sua privacidade é importante para nós. As informações coletadas estão sujeitas à
                nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">
                5. Limitação de Responsabilidade
              </h2>
              <p>
                A AirFinance não será responsável por quaisquer danos indiretos, incidentais,
                especiais, consequenciais ou punitivos resultantes do uso ou da incapacidade de usar
                o serviço.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">6. Alterações nos Termos</h2>
              <p>
                Podemos atualizar estes Termos de Serviço periodicamente. Notificaremos sobre
                quaisquer alterações significativas publicando os novos termos nesta página.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-gray-100">7. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos, entre em contato conosco através do nosso
                suporte.
              </p>
            </section>
          </div>
        </div>
      </main>
    </PublicDarkLayout>
  );
}
