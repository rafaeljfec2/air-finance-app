import { useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';

export function ScoreCreditoFinancasPessoaisPage() {
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Score de Crédito e Finanças Pessoais: Relação Prática"
        description="Entenda a relação entre organização financeira e score de crédito. Comportamentos que afetam score e como controle financeiro ajuda indiretamente."
        canonical="https://airfinance.com.br/gestao-financeira-cpf/score-credito-e-financas-pessoais"
        articleSchema={{
          headline: 'Score de Crédito e Finanças Pessoais: Relação Prática',
          author: 'Air Finance',
          datePublished: '2024-01-01',
          dateModified: '2024-01-01',
        }}
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
                <InternalLink
                  to="/gestao-financeira-cpf"
                  className="hover:text-brand-arrow transition-colors"
                >
                  Gestão Financeira CPF
                </InternalLink>
                <ChevronRight className="w-4 h-4 text-text/40 text-white" />
                <span className="text-text font-medium">Score de Crédito</span>
              </nav>
            </div>
          </header>

        <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
            <h1>Score de Crédito e Finanças Pessoais: Como se Relacionam</h1>

            <section className="mb-12">
                <div className="prose-lg text-text/90 leading-relaxed bg-brand-arrow/5 rounded-xl p-6 border-l-4 border-brand-arrow">
                  <p className="m-0 text-lg font-medium">
                    Organização financeira pessoal não melhora score de crédito diretamente, mas
                indiretamente sim. Quando você controla seus gastos, paga contas em dia e evita
                endividamento excessivo, seu score melhora naturalmente. Este guia explica a
                relação prática entre organização financeira e score.
                  </p>
                </div>
              </section>

            <section>
              <h2>O Que é Score de Crédito</h2>
              <p>
                Score de crédito é uma pontuação (geralmente de 0 a 1000) que representa sua
                capacidade de pagamento e histórico de crédito. Instituições financeiras usam
                score para decidir se aprovam empréstimos, cartões de crédito e outros produtos.
              </p>
              <p>
                Score é calculado por bureaus de crédito (Serasa, Boa Vista, SPC) baseado em:
              </p>
              <ul>
                <li>Histórico de pagamentos (atrasos, pagamentos em dia)</li>
                <li>Nível de endividamento (quanto você deve vs. quanto ganha)</li>
                <li>Tempo de histórico de crédito</li>
                <li>Tipos de crédito utilizados (cartão, empréstimo, financiamento)</li>
                <li>Consultas recentes ao seu CPF</li>
              </ul>
            </section>

            <section>
              <h2>Relação Entre Organização Financeira e Score</h2>
              <p>
                Organização financeira não melhora score diretamente (bureaus não têm acesso aos
                seus dados de controle financeiro), mas melhora indiretamente através de
                comportamentos que afetam score:
              </p>

              <h3>Pagamentos em Dia</h3>
              <p>
                Quando você tem{' '}
                <InternalLink to="/gestao-financeira-cpf/organizacao-financeira-pessoal">
                  organização financeira
                </InternalLink>
                , você sabe quando suas contas vencem e tem dinheiro disponível para pagar. Isso
                reduz atrasos, que são um dos principais fatores que afetam score negativamente.
              </p>

              <h3>Controle de Endividamento</h3>
              <p>
                Com{' '}
                <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                  controle financeiro
                </InternalLink>
                , você sabe quanto pode comprometer da sua renda. Isso evita endividamento
                excessivo, que reduz score. Bureaus consideram nível de endividamento ao calcular
                score.
              </p>

              <h3>Planejamento de Gastos</h3>
              <p>
                Organização financeira permite planejar gastos grandes ao invés de usar crédito de
                emergência. Menos uso de crédito não planejado melhora seu perfil de crédito.
              </p>

              <h3>Reserva de Emergência</h3>
              <p>
                Quando você tem reserva de emergência (consequência de organização financeira),
                você não precisa usar crédito para imprevistos. Isso evita acúmulo de dívidas que
                afetam score.
              </p>
            </section>

            <section>
              <h2>Comportamentos que Afetam Score</h2>
              <p>
                Entender quais comportamentos afetam score ajuda a melhorá-lo:
              </p>

              <h3>Comportamentos que Reduzem Score</h3>
              <ul>
                <li>
                  <strong>Atrasos:</strong> Pagar contas após o vencimento reduz score
                  significativamente
                </li>
                <li>
                  <strong>Endividamento alto:</strong> Usar mais de 30% do limite do cartão ou
                  comprometer mais de 30% da renda com dívidas
                </li>
                <li>
                  <strong>Muitas consultas:</strong> Muitas consultas ao CPF em pouco tempo sugere
                  busca desesperada por crédito
                </li>
                <li>
                  <strong>Não ter histórico:</strong> Nunca ter usado crédito significa que
                  instituições não têm dados sobre você
                </li>
                <li>
                  <strong>Dívidas negativadas:</strong> Ser negativado reduz score drasticamente
                </li>
              </ul>

              <h3>Comportamentos que Melhoram Score</h3>
              <ul>
                <li>
                  <strong>Pagamentos em dia:</strong> Pagar todas as contas antes do vencimento
                  consistentemente
                </li>
                <li>
                  <strong>Uso moderado de crédito:</strong> Usar crédito regularmente, mas de forma
                  moderada (menos de 30% do limite)
                </li>
                <li>
                  <strong>Histórico longo:</strong> Ter histórico de crédito longo e positivo
                </li>
                <li>
                  <strong>Diversidade de crédito:</strong> Ter diferentes tipos de crédito (cartão,
                  financiamento, empréstimo) paga de forma responsável
                </li>
                <li>
                  <strong>Renda estável:</strong> Ter renda estável e comprovada (não afeta score
                  diretamente, mas afeta análise de crédito)
                </li>
              </ul>
            </section>

            <section>
              <h2>Como Controle Financeiro Ajuda Indiretamente</h2>
              <p>
                Controle financeiro ajuda a melhorar score indiretamente ao facilitar
                comportamentos positivos:
              </p>

              <h3>1. Lembrete de Vencimentos</h3>
              <p>
                Ferramentas de{' '}
                <InternalLink to="/gestao-financeira-cpf" className="hover:text-brand-arrow transition-colors">gestão financeira</InternalLink>{' '}
                lembram quando contas vencem. Você não esquece de pagar, evitando atrasos que
                reduzem score.
              </p>

              <h3>2. Visão de Endividamento</h3>
              <p>
                Com controle financeiro, você vê quanto está devendo vs. quanto ganha. Isso ajuda
                a evitar endividamento excessivo que reduz score.
              </p>

              <h3>3. Planejamento de Pagamentos</h3>
              <p>
                Organização financeira permite planejar pagamentos grandes. Você evita usar crédito
                de forma desesperada, o que reduz consultas excessivas ao CPF.
              </p>

              <h3>4. Identificação de Padrões</h3>
              <p>
                Controle financeiro ajuda a identificar padrões de gasto. Você vê quando gasta mais
                e pode planejar, evitando necessidade de crédito de emergência.
              </p>

              <h3>5. Construção de Reserva</h3>
              <p>
                Organização financeira permite construir reserva de emergência. Com reserva, você
                não precisa usar crédito para imprevistos, evitando acúmulo de dívidas.
              </p>
            </section>

            <section>
              <h2>Estratégia Prática para Melhorar Score</h2>
              <ol>
                <li>
                  <strong>Organize suas finanças:</strong> Comece com{' '}
                  <InternalLink to="/gestao-financeira-cpf/organizacao-financeira-pessoal">
                    organização financeira básica
                  </InternalLink>
                  . Registre receitas e despesas, crie orçamento
                </li>
                <li>
                  <strong>Pague tudo em dia:</strong> Use controle financeiro para lembrar de
                  vencimentos. Priorize pagamentos em dia acima de tudo
                </li>
                <li>
                  <strong>Controle endividamento:</strong> Mantenha dívidas abaixo de 30% da sua
                  renda. Use controle financeiro para monitorar
                </li>
                <li>
                  <strong>Use crédito moderadamente:</strong> Use cartão de crédito regularmente,
                  mas pague total todo mês. Isso constrói histórico positivo
                </li>
                <li>
                  <strong>Construa reserva:</strong> Com organização financeira, construa reserva
                  de emergência. Isso evita necessidade de crédito de emergência
                </li>
                <li>
                  <strong>Paciência:</strong> Melhorar score leva tempo (meses, não semanas).
                  Mantenha comportamentos positivos consistentemente
                </li>
              </ol>
            </section>

            <section>
              <h2>O Que Não Funciona</h2>
              <p>
                Algumas coisas que as pessoas pensam que melhoram score, mas não funcionam:
              </p>
              <ul>
                <li>
                  <strong>Ganhar mais dinheiro:</strong> Score não considera renda diretamente,
                  considera capacidade de pagamento (endividamento vs. renda)
                </li>
                <li>
                  <strong>Ter muito dinheiro na conta:</strong> Bureaus não têm acesso a saldos
                  bancários, apenas histórico de crédito
                </li>
                <li>
                  <strong>Fechar contas antigas:</strong> Pode até reduzir score ao reduzir
                  histórico de crédito
                </li>
                <li>
                  <strong>Consultar score frequentemente:</strong> Consultar seu próprio score não
                  afeta, mas muitas consultas de instituições financeiras podem afetar
                </li>
              </ul>
            </section>

            <section>
              <h2>Links Relacionados</h2>
              <ul>
                <li>
                  <InternalLink to="/gestao-financeira-cpf" className="hover:text-brand-arrow transition-colors">
                    Gestão Financeira CPF: Guia Completo
                  </InternalLink>
                </li>
                <li>
                  <InternalLink to="/gestao-financeira-cpf/organizacao-financeira-pessoal">
                    Organização Financeira Pessoal
                  </InternalLink>
                </li>
                <li>
                  <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                    Controle Financeiro Pessoal
                  </InternalLink>
                </li>
              </ul>
            </section>

                          <section className="mt-16 border-t border-border pt-12">
                <div className="bg-gradient-to-r from-brand-arrow/5 to-transparent rounded-2xl p-8 border border-border/50">
                  <p className="text-text/80 mb-6 text-lg">
                    Pronto para melhorar sua gestão financeira?
                  </p>
                  <InternalLink
                    to="/register"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-arrow text-white rounded-xl font-semibold hover:bg-brand-arrow/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-arrow/25 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2 transform hover:-translate-y-0.5 [&>*]:text-white"
                  >
                    <span className="text-white">Comece agora</span>
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
