import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';
import { usePageScroll } from '@/hooks/usePageScroll';

export function GestaoFinanceiraCPFPage() {
  usePageScroll();
  const faqItems = [
    {
      question: 'O que é gestão financeira pessoal?',
      answer:
        'Gestão financeira pessoal é o controle consciente de entradas e saídas de dinheiro, permitindo entender gastos, planejar objetivos e tomar decisões financeiras com base em dados reais.',
    },
    {
      question: 'Qual a melhor forma de organizar finanças pessoais?',
      answer:
        'A melhor forma é acompanhar receitas e despesas regularmente, categorizar gastos e usar ferramentas que automatizam esse processo para evitar erros manuais.',
    },
    {
      question: 'Planilha ainda funciona para controle financeiro?',
      answer:
        'Planilhas funcionam no início, mas tendem a falhar com o tempo por dependerem de preenchimento manual e não refletirem gastos recorrentes automaticamente.',
    },
    {
      question: 'Automação financeira é segura para pessoa física?',
      answer:
        'Sim, desde que utilize plataformas que sigam boas práticas de segurança, criptografia e proteção de dados conforme a LGPD.',
    },
    {
      question: 'Inteligência artificial pode ajudar na gestão financeira pessoal?',
      answer:
        'Pode sim, especialmente na categorização automática de gastos, identificação de padrões e geração de alertas financeiros.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Gestão financeira pessoal: organize suas finanças com inteligência"
        description="Aprenda como organizar suas finanças pessoais, controlar gastos e usar automação e IA para ter clareza financeira no dia a dia."
        canonical="https://airfinance.com.br/gestao-financeira-cpf"
        articleSchema={{
          headline: 'Gestão financeira pessoal: como organizar suas finanças de forma inteligente',
          author: 'Air Finance',
          datePublished: '2024-01-01',
          dateModified: '2024-01-01',
        }}
        faqSchema={faqItems}
      />
      <div className="min-h-screen bg-background text-text">
        <Header />
        <div className="pt-24">
          <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-30">
            <div className="mx-auto max-w-4xl px-6 py-4">
              <nav className="flex items-center gap-2 text-sm text-text/70">
                <InternalLink
                  to="/"
                  className="flex items-center gap-1 hover:text-brand-arrow transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Início</span>
                </InternalLink>
                <ChevronRight className="w-4 h-4 text-text/40 text-white" />
                <span className="text-text font-medium">Gestão Financeira CPF</span>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
              <h1>Gestão financeira pessoal: como organizar suas finanças de forma inteligente</h1>

              <section>
                <p className="lead border-l-4 border-brand-arrow pl-4 bg-brand-arrow/5 rounded-r-lg py-2">
                  No fim do mês, você olha o saldo bancário e não entende para onde foi o dinheiro.
                  Receitas conhecidas, gastos que pareciam controlados, mas o resultado não fecha.
                  Essa falta de clareza financeira acontece porque o dinheiro se move de forma
                  invisível: pequenas despesas se acumulam, assinaturas se renovam automaticamente,
                  e gastos recorrentes passam despercebidos. Este guia mostra como ter visibilidade
                  real sobre suas finanças pessoais.
                </p>
              </section>

              <section>
                <h2>O que é gestão financeira pessoal na prática</h2>
                <p>
                  Gestão financeira pessoal é o controle do fluxo de dinheiro que entra e sai. Não é
                  teoria de investimentos ou planejamento complexo. É registrar, categorizar e
                  analisar o que acontece com seu dinheiro no dia a dia.
                </p>
                <p>O fluxo funciona em três etapas:</p>
                <ol>
                  <li>
                    <strong>Entrada:</strong> Todo dinheiro que chega (salário, rendimentos, vendas,
                    aluguéis recebidos)
                  </li>
                  <li>
                    <strong>Saída:</strong> Todo dinheiro que sai (despesas fixas, variáveis,
                    compras, pagamentos)
                  </li>
                  <li>
                    <strong>Análise:</strong> Comparar entradas e saídas, identificar padrões e
                    tomar decisões baseadas em dados reais
                  </li>
                </ol>
                <p>
                  Sem esse controle, você toma decisões financeiras baseadas em sensação. Com ele,
                  você sabe exatamente quanto pode gastar, onde está desperdiçando e quais ajustes
                  fazer.
                </p>
              </section>

              <section>
                <h2>Erros comuns na gestão financeira de CPF</h2>

                <h3>Gastos invisíveis</h3>
                <p>
                  Pequenos gastos que passam despercebidos: cafezinho diário (R$ 5), delivery
                  esporádico (R$ 30), compras por impulso na farmácia (R$ 20). Individualmente
                  parecem insignificantes, mas somados podem representar 15% a 20% do orçamento
                  mensal. Sem registro, você não vê esse consumo.
                </p>

                <h3>Falta de categorização</h3>
                <p>
                  Registrar gastos sem categorizar (alimentação, transporte, lazer, saúde) impede
                  identificar onde o dinheiro está indo de fato. Você pode achar que gasta muito em
                  restaurantes, mas descobrir que a maior parte vai para transporte ou para
                  farmácias/hospitais. Sem categorização, não há como analisar padrões.
                </p>

                <h3>Decisão baseada em sensação</h3>
                <p>
                  Tomar decisões financeiras sem consultar dados reais: cortar gastos
                  aleatoriamente, fazer uma compra grande porque &quot;parece que sobra
                  dinheiro&quot;, assumir dívidas sem calcular o impacto no orçamento mensal.
                  Sensação é subjetiva; dados são objetivos.
                </p>
              </section>

              <section>
                <h2>Como organizar finanças pessoais de forma eficiente</h2>
                <p>Organização financeira eficiente é rotina mensal, não processo complexo:</p>

                <h3>Mês 1: Registro completo</h3>
                <p>
                  Registre todas as receitas e todas as despesas durante um mês inteiro. Use uma
                  planilha simples, aplicativo ou até caderno. O importante é não esquecer nada:
                  desde o aluguel até o cafezinho. Ao final do mês, você terá um panorama real do
                  seu fluxo financeiro.
                </p>

                <h3>Mês 2: Categorização e análise</h3>
                <p>
                  Categorize todos os gastos do mês anterior (alimentação, transporte, moradia,
                  saúde, lazer, educação). Some cada categoria. Identifique as três categorias que
                  mais consomem seu orçamento. Compare receitas totais com despesas totais. Se
                  estiver negativo, você está gastando mais do que ganha.
                </p>

                <h3>Mês 3 em diante: Orçamento e ajustes</h3>
                <p>
                  Com dados reais, crie um orçamento mensal. Defina quanto pode gastar em cada
                  categoria com base no histórico real, não em estimativas. Acompanhe semanalmente
                  se está dentro do orçamento. Ajuste categorias que estão acima do planejado.
                  Mantenha o registro constante para manter a visibilidade.
                </p>

                <p>
                  Para detalhes práticos, consulte{' '}
                  <InternalLink to="/gestao-financeira-cpf/organizacao-financeira-pessoal">
                    organização financeira pessoal
                  </InternalLink>
                  .
                </p>
              </section>

              <section>
                <h2>Automação financeira para pessoas físicas</h2>
                <p>A automação financeira resolve problemas práticos do controle manual:</p>

                <h3>Onde a automação ajuda</h3>
                <ul>
                  <li>
                    <strong>Importação automática:</strong> Extratos bancários são importados
                    automaticamente, eliminando a necessidade de digitar transações manualmente
                  </li>
                  <li>
                    <strong>Registro sem esforço:</strong> Transações aparecem automaticamente no
                    sistema, sem risco de esquecimento
                  </li>
                  <li>
                    <strong>Precisão:</strong> Dados vêm direto do banco, sem erros de digitação ou
                    omissões
                  </li>
                  <li>
                    <strong>Análise automática:</strong> Gráficos e relatórios são gerados
                    automaticamente, mostrando padrões que você não identificaria manualmente
                  </li>
                </ul>

                <h3>Onde a automação não ajuda</h3>
                <ul>
                  <li>
                    <strong>Decisões financeiras:</strong> Automação não decide por você. Ela
                    fornece dados; você decide o que fazer com eles
                  </li>
                  <li>
                    <strong>Gastos em dinheiro:</strong> Se você gasta muito em dinheiro físico,
                    ainda precisa registrar manualmente ou usar métodos de pagamento rastreáveis
                  </li>
                  <li>
                    <strong>Disciplina:</strong> Automação facilita o controle, mas não cria
                    disciplina automaticamente. Você ainda precisa revisar dados e tomar decisões
                  </li>
                </ul>

                <p>
                  Saiba mais sobre{' '}
                  <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                    controle financeiro pessoal automatizado
                  </InternalLink>
                  .
                </p>
              </section>

              <section>
                <h2>Uso de inteligência artificial na gestão financeira pessoal</h2>
                <p>
                  Inteligência artificial aplicada a finanças pessoais resolve tarefas repetitivas e
                  identifica padrões, mas tem limitações claras:
                </p>

                <h3>Categorização automática</h3>
                <p>
                  <InternalLink to="/gestao-financeira-cpf/categorizacao-automatica-gastos">
                    Sistemas com IA categorizam transações bancárias automaticamente
                  </InternalLink>
                  . Uma compra no supermercado é classificada como &quot;alimentação&quot;, um
                  pagamento em posto como &quot;transporte&quot;. A IA aprende com suas
                  categorizações anteriores e melhora com o tempo, reduzindo trabalho manual em 80%
                  a 90%.
                </p>

                <h3>Detecção de padrões</h3>
                <p>
                  IA identifica padrões nos seus gastos que você não perceberia facilmente: aumentos
                  sazonais (dezembro costuma ser mais caro), correlações (quando gasta mais em
                  lazer, gasta menos em alimentação), ou ciclos (gastos maiores em determinados dias
                  da semana).
                </p>

                <h3>Alertas financeiros</h3>
                <p>
                  Sistemas podem alertar quando um gasto está acima da média histórica, quando você
                  está próximo do limite do orçamento em uma categoria, ou quando há transações
                  suspeitas. São alertas simples baseados em regras, não previsões complexas.
                </p>

                <h3>Limitações da IA</h3>
                <p>
                  IA pode errar na categorização (especialmente em descrições bancárias genéricas),
                  não entende contexto pessoal (um gasto que para você é &quot;necessário&quot; pode
                  ser classificado como &quot;opcional&quot;), e não toma decisões financeiras por
                  você. Ela automatiza tarefas, mas análise e decisão continuam sendo humanas.
                </p>

                <p>
                  Leia mais sobre{' '}
                  <InternalLink to="/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial">
                    gestão financeira com inteligência artificial
                  </InternalLink>
                  .
                </p>
              </section>

              <section>
                <h2>Segurança e privacidade de dados financeiros</h2>
                <p>
                  Ao compartilhar dados financeiros com sistemas de gestão, segurança e privacidade
                  são essenciais:
                </p>

                <h3>Criptografia</h3>
                <p>
                  Dados devem ser criptografados em trânsito (HTTPS/TLS quando trafegam pela
                  internet) e em repouso (quando armazenados em servidores). Criptografia garante
                  que mesmo que dados sejam interceptados, não podem ser lidos sem a chave de
                  descriptografia.
                </p>

                <h3>Autenticação</h3>
                <p>
                  Autenticação multifator (senha + código SMS ou aplicativo autenticador) adiciona
                  camada extra de segurança. Mesmo que alguém descubra sua senha, precisa do segundo
                  fator para acessar sua conta.
                </p>

                <h3>Conformidade com LGPD</h3>
                <p>
                  Sistemas devem estar em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                  Isso significa: transparência sobre coleta e uso de dados, direito de acesso e
                  exclusão, notificação de vazamentos, e consentimento explícito para
                  compartilhamento com terceiros. Verifique a política de privacidade antes de usar
                  qualquer plataforma.
                </p>

                <h3>Boas práticas de uso</h3>
                <p>
                  Use senhas fortes e únicas, ative autenticação multifator quando disponível,
                  revise permissões de acesso periodicamente, e desative contas que não usa mais.
                  Não compartilhe credenciais bancárias diretamente; use APIs seguras ou importação
                  de extratos quando possível.
                </p>
              </section>

              <section className="mt-16">
                <h2 className="text-3xl font-bold mb-8">Perguntas Frequentes</h2>
                <div className="space-y-6">
                  {faqItems.map((item) => (
                    <div
                      key={item.question}
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-text mb-3">{item.question}</h3>
                      <p className="text-text/80 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2>Links relacionados</h2>
                <ul>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                      Controle Financeiro Pessoal: Guia Prático
                    </InternalLink>
                  </li>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/organizacao-financeira-pessoal">
                      Organização Financeira Pessoal
                    </InternalLink>
                  </li>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/categorizacao-automatica-gastos">
                      Categorização Automática de Gastos
                    </InternalLink>
                  </li>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial">
                      Gestão Financeira com Inteligência Artificial
                    </InternalLink>
                  </li>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/score-credito-e-financas-pessoais">
                      Score de Crédito e Finanças Pessoais
                    </InternalLink>
                  </li>
                </ul>
              </section>

              <section className="mt-16 border-t border-border pt-12">
                <div className="bg-gradient-to-r from-brand-arrow/5 to-transparent rounded-2xl p-8 border border-border/50">
                  <h2 className="text-2xl font-bold text-text mb-4">
                    Comece a organizar suas finanças hoje
                  </h2>
                  <p className="text-text/80 mb-6 text-lg">
                    Gestão financeira pessoal eficiente requer método e ferramentas adequadas.
                    Comece registrando seus gastos por 30 dias. Depois, use uma plataforma que
                    automatize o processo e forneça insights baseados em seus dados reais.
                  </p>
                  <InternalLink
                    to="/register"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-arrow text-white rounded-xl font-semibold hover:bg-brand-arrow/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-arrow/25 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2 transform hover:-translate-y-0.5 [&>*]:text-white"
                  >
                    <span className="text-white">Experimente gratuitamente</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                  </InternalLink>
                </div>
              </section>
            </article>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
