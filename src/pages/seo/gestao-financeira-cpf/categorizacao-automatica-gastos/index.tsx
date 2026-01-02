import { useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';

export function CategorizacaoAutomaticaGastosPage() {
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
        title="Categorização automática de gastos: como funciona e por que usar"
        description="Entenda como funciona a categorização automática de gastos, seus benefícios e limitações para finanças pessoais."
        canonical="https://airfinance.com.br/gestao-financeira-cpf/categorizacao-automatica-gastos"
        articleSchema={{
          headline: 'Categorização Automática de Gastos: Como Funciona',
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
                <span className="text-text font-medium">Categorização Automática de Gastos</span>
              </nav>
            </div>
          </header>

        <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
            <h1>Categorização Automática de Gastos: Como IA Classifica Suas Transações</h1>

            <section className="mb-12">
                <div className="prose-lg text-text/90 leading-relaxed bg-brand-arrow/5 rounded-xl p-6 border-l-4 border-brand-arrow">
                  <p className="m-0 text-lg font-medium">
                    Categorização automática de gastos é uma das funcionalidades mais práticas da gestão
                financeira moderna. Ao invés de classificar manualmente cada transação, a
                inteligência artificial aprende seus padrões e categoriza automaticamente. Este guia
                explica como funciona, por que manual não escala e quais são os benefícios reais.
                  </p>
                </div>
              </section>

            <section>
              <h2>O Que é Categorização de Gastos</h2>
              <p>
                Categorização é o processo de classificar cada transação financeira em uma categoria
                (alimentação, transporte, saúde, lazer, etc.). Isso permite:
              </p>
              <ul>
                <li>Saber quanto você gasta em cada área</li>
                <li>Comparar gastos entre meses</li>
                <li>Identificar categorias que consomem muito do orçamento</li>
                <li>Criar orçamentos por categoria</li>
                <li>Analisar padrões de gasto</li>
              </ul>
              <p>
                Sem categorização, você só sabe o total gasto, não sabe para onde foi. Com
                categorização, você tem visão detalhada e pode tomar decisões baseadas em dados.
              </p>
            </section>

            <section>
              <h2>Por Que Categorização Manual Não Escala</h2>
              <p>
                Categorização manual funciona quando você tem poucas transações. Mas quando você tem
                dezenas ou centenas de transações por mês, manual se torna inviável:
              </p>

              <h3>1. Tempo Consumido</h3>
              <p>
                Classificar manualmente 100 transações por mês leva tempo. Mesmo que sejam 2 minutos
                por transação, são 200 minutos (mais de 3 horas) por mês só categorizando. Esse
                tempo poderia ser usado para análise, não para trabalho repetitivo.
              </p>

              <h3>2. Inconsistência</h3>
              <p>
                Classificar manualmente leva a inconsistências. Um dia você classifica
                &quot;Farmácia&quot; como &quot;Saúde&quot;, outro dia como &quot;Compras&quot;.
                Essa inconsistência dificulta análise posterior e comparação entre períodos.
              </p>

              <h3>3. Desistência</h3>
              <p>
                A maioria das pessoas desiste de categorizar manualmente após algumas semanas ou
                meses. É trabalho tedioso que não agrega valor imediato. Sem categorização, você
                perde a visão detalhada dos gastos.
              </p>

              <h3>4. Erros</h3>
              <p>
                Classificação manual está sujeita a erros. Você pode classificar errado por
                distração, ou não ter certeza de qual categoria usar. Erros distorcem a análise.
              </p>
            </section>

            <section>
              <h2>Como IA Classifica Transações Automaticamente</h2>
              <p>
                Sistemas de categorização automática usam inteligência artificial para aprender
                padrões e classificar transações:
              </p>

              <h3>Processamento de Linguagem Natural (NLP)</h3>
              <p>
                A IA analisa a descrição da transação (texto que aparece no extrato bancário). Por
                exemplo, uma transação com descrição &quot;SUPERMERCADO X&quot; é analisada e a IA
                identifica palavras-chave que sugerem categoria &quot;Alimentação&quot;.
              </p>

              <h3>Aprendizado com Histórico</h3>
              <p>
                A IA aprende com suas categorizações anteriores. Se você sempre classifica
                transações do &quot;Farmácia Y&quot; como &quot;Saúde&quot;, a IA aprende esse
                padrão e passa a classificar automaticamente. Quanto mais transações categorizadas,
                melhor a IA fica.
              </p>

              <h3>Padrões de Estabelecimento</h3>
              <p>
                A IA aprende que determinados estabelecimentos geralmente estão em determinadas
                categorias. &quot;Posto de Gasolina&quot; geralmente é &quot;Transporte&quot;.
                &quot;Cinema&quot; geralmente é &quot;Lazer&quot;. Esses padrões são aprendidos
                coletivamente (de todos os usuários) e individualmente (dos seus padrões).
              </p>

              <h3>Confiança e Correção</h3>
              <p>
                Sistemas mostram nível de confiança da categorização. Se a IA não tem certeza, ela
                pode perguntar ou sugerir categorias. Você pode corrigir quando necessário, e a IA
                aprende com essas correções.
              </p>
            </section>

            <section>
              <h2>Limitações da IA na Categorização</h2>
              <p>IA não é perfeita. Entender limitações ajuda a usar melhor:</p>

              <h3>Transações Ambíguas</h3>
              <p>
                Algumas transações são ambíguas. Uma compra em &quot;Farmácia&quot; pode ser
                medicamento (Saúde) ou produto de higiene (Casa). IA pode errar nesses casos, e você
                precisa corrigir manualmente.
              </p>

              <h3>Estabelecimentos Novos</h3>
              <p>
                Quando você compra em um estabelecimento pela primeira vez, a IA pode não ter
                contexto suficiente para categorizar corretamente. Com o tempo e suas correções, a
                IA aprende.
              </p>

              <h3>Transações Genéricas</h3>
              <p>
                Transações com descrições muito genéricas (apenas números de conta, por exemplo) são
                difíceis de categorizar. IA pode sugerir, mas você precisa classificar manualmente.
              </p>

              <h3>Contexto Pessoal</h3>
              <p>
                Algumas categorizações dependem de contexto pessoal que a IA não tem. Para uma
                pessoa, &quot;Livraria&quot; pode ser &quot;Educação&quot;, para outra pode ser
                &quot;Lazer&quot;. IA aprende com suas escolhas, mas pode errar inicialmente.
              </p>

              <p>
                Apesar das limitações, IA acerta na maioria dos casos (85-95% de precisão é comum).
                Os 5-15% restantes você corrige manualmente, e mesmo assim economiza muito tempo.
              </p>
            </section>

            <section>
              <h2>Benefícios Reais para CPF</h2>
              <p>Categorização automática traz benefícios práticos para pessoas físicas:</p>

              <h3>Economia de Tempo</h3>
              <p>
                Você não precisa gastar horas por mês categorizando. Tempo economizado pode ser
                usado para análise e planejamento.
              </p>

              <h3>Consistência</h3>
              <p>
                IA categoriza de forma consistente. Mesmas regras, mesmas categorias, facilitando
                análise e comparação entre períodos.
              </p>

              <h3>Visão Detalhada</h3>
              <p>
                Com categorização automática, você mantém visão detalhada dos gastos sem esforço.
                Isso permite identificar onde está gastando muito e onde pode economizar.
              </p>

              <h3>Orçamentos por Categoria</h3>
              <p>
                Com categorias bem definidas, você pode criar orçamentos por categoria. IA ajuda a
                alertar quando você está se aproximando do limite de uma categoria.
              </p>

              <h3>Análise de Padrões</h3>
              <p>
                Com categorias consistentes, você pode analisar padrões: &quot;gasto mais em lazer
                em fins de semana&quot;, &quot;gasto mais em alimentação em dezembro&quot;. Esses
                padrões ajudam no planejamento.
              </p>
            </section>

            <section>
              <h2>Como Funciona na Prática</h2>
              <ol>
                <li>
                  <strong>Primeiro uso:</strong> Você importa extratos bancários. IA categoriza
                  automaticamente baseado em padrões gerais
                </li>
                <li>
                  <strong>Correção inicial:</strong> Você corrige categorizações erradas. IA aprende
                  com suas correções
                </li>
                <li>
                  <strong>Uso contínuo:</strong> Com o tempo, IA fica mais precisa para seus
                  padrões. Você precisa corrigir cada vez menos
                </li>
                <li>
                  <strong>Benefício:</strong> Mesmo corrigindo 10-15% das categorizações, você
                  economiza 85-90% do tempo que gastaria fazendo tudo manualmente
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
                  <InternalLink to="/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial">
                    Gestão Financeira com Inteligência Artificial
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
                    <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
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
