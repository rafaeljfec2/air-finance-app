import { useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';

export function ControleFinanceiroPessoalPage() {
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
        title="Controle Financeiro Pessoal: Como Fazer na Prática"
        description="Guia prático de controle financeiro pessoal. Métodos, ferramentas e técnicas para controlar gastos, criar orçamento e alcançar metas financeiras."
        canonical="https://airfinance.com.br/gestao-financeira-cpf/controle-financeiro-pessoal"
        articleSchema={{
          headline: 'Controle Financeiro Pessoal: Como Fazer na Prática',
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
                <ChevronRight className="w-4 h-4 text-text/40" />
                <InternalLink
                  to="/gestao-financeira-cpf"
                  className="hover:text-brand-arrow transition-colors"
                >
                  Gestão Financeira CPF
                </InternalLink>
                <ChevronRight className="w-4 h-4 text-text/40" />
                <span className="text-text font-medium">Controle Financeiro Pessoal</span>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
              <h1>Controle Financeiro Pessoal: Como Controlar Gastos na Prática</h1>

              <section className="mb-12">
                <div className="prose-lg text-text/90 leading-relaxed bg-brand-arrow/5 rounded-xl p-6 border-l-4 border-brand-arrow">
                  <p className="m-0 text-lg font-medium">
                    Controle financeiro pessoal é a base de tudo. Sem saber quanto você gasta,
                    qualquer planejamento é baseado em suposições. Este guia explica métodos
                    práticos para controlar gastos pessoais, identificar erros comuns e escolher
                    entre controle manual e automatizado.
                  </p>
                </div>
              </section>

              <section>
                <h2>Como Controlar Gastos Pessoais</h2>
                <p>Controle de gastos pessoais funciona em três etapas simples:</p>
                <ol>
                  <li>
                    <strong>Registrar tudo:</strong> Todas as receitas e todas as despesas, sem
                    exceção
                  </li>
                  <li>
                    <strong>Categorizar:</strong> Agrupar gastos por tipo (alimentação, transporte,
                    lazer)
                  </li>
                  <li>
                    <strong>Revisar:</strong> Analisar periodicamente para identificar padrões e
                    ajustar comportamento
                  </li>
                </ol>
                <p>
                  Parece simples, mas a maioria das pessoas falha na primeira etapa: registrar tudo.
                  Gastos pequenos são esquecidos, e pequenos gastos somados viram valores
                  significativos.
                </p>
              </section>

              <section>
                <h2>Erros Comuns de Quem Usa Planilha</h2>
                <p>
                  Planilhas são um bom começo, mas têm armadilhas que fazem muitas pessoas
                  desistirem:
                </p>

                <h3>1. Esquecimento de Gastos Pequenos</h3>
                <p>
                  Quando você está fora de casa e compra um café, é fácil esquecer de anotar na
                  planilha quando voltar. Esses pequenos esquecimentos se acumulam e distorcem os
                  dados.
                </p>

                <h3>2. Procrastinação na Atualização</h3>
                <p>
                  Deixar para atualizar a planilha no fim do dia ou no fim da semana. Quando chega a
                  hora, você já esqueceu vários gastos ou não tem certeza dos valores exatos.
                </p>

                <h3>3. Erros de Digitação</h3>
                <p>
                  Digitar R$ 150,00 como R$ 15,00 ou R$ 1500,00 distorce completamente a análise.
                  Planilhas não avisam quando você comete esse tipo de erro.
                </p>

                <h3>4. Categorização Inconsistente</h3>
                <p>
                  Um dia você classifica &quot;supermercado&quot; como alimentação, outro dia como
                  &quot;casa&quot;. A inconsistência dificulta análise posterior e comparação entre
                  períodos.
                </p>

                <h3>5. Falta de Contexto</h3>
                <p>
                  Planilhas mostram números, mas não mostram padrões facilmente. Identificar que
                  você gasta mais em fins de semana ou em determinados meses requer análise manual
                  trabalhosa.
                </p>
              </section>

              <section>
                <h2>Diferença Entre Controle Manual e Automatizado</h2>

                <h3>Controle Manual (Planilha)</h3>
                <p>
                  <strong>Vantagens:</strong>
                </p>
                <ul>
                  <li>Controle total sobre categorização</li>
                  <li>Não depende de internet ou aplicativos</li>
                  <li>Pode ser personalizado completamente</li>
                  <li>Gratuito</li>
                </ul>
                <p>
                  <strong>Desvantagens:</strong>
                </p>
                <ul>
                  <li>Requer disciplina constante</li>
                  <li>Consome tempo para manter atualizado</li>
                  <li>Sujeito a erros humanos</li>
                  <li>Análise limitada (requer trabalho manual)</li>
                </ul>

                <h3>Controle Automatizado (Aplicativos/Plataformas)</h3>
                <p>
                  <strong>Vantagens:</strong>
                </p>
                <ul>
                  <li>Importação automática de extratos bancários</li>
                  <li>Não precisa lembrar de anotar nada</li>
                  <li>Precisão (dados vêm direto da fonte)</li>
                  <li>Análise automática com gráficos e relatórios</li>
                  <li>
                    <InternalLink to="/gestao-financeira-cpf/categorizacao-automatica-gastos">
                      Categorização automática
                    </InternalLink>{' '}
                    com IA
                  </li>
                </ul>
                <p>
                  <strong>Desvantagens:</strong>
                </p>
                <ul>
                  <li>Depende de conexão com bancos (requer autorização)</li>
                  <li>Pode ter custo (mesmo que baixo)</li>
                  <li>Menos personalização que planilha própria</li>
                </ul>

                <p>
                  Para a maioria das pessoas, controle automatizado é mais eficiente porque elimina
                  as barreiras que fazem o controle manual falhar: esquecimento e falta de tempo.
                </p>
              </section>

              <section>
                <h2>Exemplos Práticos</h2>

                <h3>Exemplo 1: Identificando Vazamentos</h3>
                <p>
                  Maria começou a controlar seus gastos e descobriu que gastava R$ 450 por mês em
                  delivery. Ela não tinha ideia que era tanto, porque os pedidos eram pequenos (R$
                  25-30 cada) e esparsos. Com controle, ela identificou o padrão e reduziu para R$
                  150/mês, economizando R$ 300/mês.
                </p>

                <h3>Exemplo 2: Assinaturas Esquecidas</h3>
                <p>
                  João estava usando uma planilha manual e sempre esquecia de anotar algumas
                  despesas. Quando migrou para controle automatizado, descobriu três assinaturas que
                  pagava há meses sem usar: streaming (R$ 45/mês), revista digital (R$ 30/mês) e app
                  de fitness (R$ 50/mês). Total: R$ 125/mês desperdiçado.
                </p>

                <h3>Exemplo 3: Sazonalidade</h3>
                <p>
                  Ana controlava seus gastos manualmente, mas não percebia padrões. Com controle
                  automatizado e gráficos, ela identificou que gasta 40% mais em dezembro e janeiro
                  (férias, presentes, viagens). Agora ela planeja e poupa durante o ano para esses
                  meses.
                </p>
              </section>

              <section>
                <h2>Como Começar o Controle Financeiro</h2>
                <ol>
                  <li>
                    <strong>Escolha o método:</strong> Planilha manual ou aplicativo automatizado
                  </li>
                  <li>
                    <strong>Registre por 30 dias:</strong> Não tente controlar tudo na primeira
                    semana. Foque em registrar tudo por um mês completo
                  </li>
                  <li>
                    <strong>Não julgue:</strong> No primeiro mês, apenas registre. Não tente cortar
                    gastos ainda. Você precisa de dados reais primeiro
                  </li>
                  <li>
                    <strong>Analise:</strong> Após 30 dias, analise onde está indo seu dinheiro.
                    Identifique os maiores gastos
                  </li>
                  <li>
                    <strong>Ajuste:</strong> Com dados reais, ajuste seu comportamento. Corte o que
                    faz sentido, mantenha o que agrega valor
                  </li>
                </ol>
              </section>

              <section>
                <h2>Links Relacionados</h2>
                <ul>
                  <li>
                    <InternalLink
                      to="/gestao-financeira-cpf"
                      className="hover:text-brand-arrow transition-colors"
                    >
                      Gestão Financeira CPF: Guia Completo
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
                </ul>
              </section>

              <section className="mt-16 border-t border-border pt-12">
                <div className="bg-gradient-to-r from-brand-arrow/5 to-transparent rounded-2xl p-8 border border-border/50">
                  <p className="text-text/80 mb-6 text-lg">
                    Pronto para começar a controlar suas finanças de forma eficiente?
                  </p>
                  <InternalLink
                    to="/register"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-arrow text-white rounded-xl font-semibold hover:bg-brand-arrow/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-arrow/25 focus:outline-none focus:ring-2 focus:ring-brand-arrow focus:ring-offset-2 transform hover:-translate-y-0.5 [&>*]:text-white"
                  >
                    <span className="text-white">Comece agora</span>
                    <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform text-white" />
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
