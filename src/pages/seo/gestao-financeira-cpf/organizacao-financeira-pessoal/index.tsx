import { useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';

export function OrganizacaoFinanceiraPessoalPage() {
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
        title="Organização financeira pessoal: método simples para o dia a dia"
        description="Saiba como organizar suas finanças pessoais, separar gastos e criar uma rotina financeira sustentável."
        canonical="https://airfinance.com.br/gestao-financeira-cpf/organizacao-financeira-pessoal"
        articleSchema={{
          headline: 'Organização Financeira Pessoal: Guia Completo',
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
                <span className="text-text font-medium">Organização Financeira Pessoal</span>
              </nav>
            </div>
          </header>
        <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
            <h1>Organização Financeira Pessoal: Como Organizar Suas Finanças Mensais</h1>
            <section className="mb-12">
                <div className="prose-lg text-text/90 leading-relaxed bg-brand-arrow/5 rounded-xl p-6 border-l-4 border-brand-arrow">
                  <p className="m-0 text-lg font-medium">
                    Organização financeira pessoal vai além de apenas controlar gastos. É sobre criar
                estrutura, separar o essencial do opcional, visualizar claramente onde está seu
                dinheiro e manter disciplina baseada em dados, não em força de vontade.
                  </p>
                </div>
              </section>
            <section>
              <h2>Organização Mensal de Finanças</h2>
              <p>
                Organização financeira funciona melhor quando é mensal. O mês é o ciclo natural de
                receitas e despesas para a maioria das pessoas:
              </p>
              <h3>Semana 1: Planejamento</h3>
              <p>
                No início do mês, revise o orçamento. Compare o mês anterior: você gastou mais ou
                menos do que planejou? Ajuste o orçamento do mês atual baseado em dados reais, não
                em estimativas.
              </p>
              <h3>Semana 2-3: Acompanhamento</h3>
              <p>
                Durante o mês, acompanhe seus gastos. Não precisa revisar diariamente, mas verifique
                semanalmente se está dentro do orçamento. Use{' '}
                <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                  controle financeiro automatizado
                </InternalLink>{' '}
                para facilitar.
              </p>
              <h3>Semana 4: Análise e Preparação</h3>
              <p>
                No final do mês, analise o que aconteceu. Identifique desvios do orçamento. Prepare
                o planejamento do próximo mês com os dados do mês atual.
              </p>
              <p>
                Essa rotina mensal cria disciplina sem ser opressiva. Você não precisa controlar
                todos os dias, mas também não deixa passar meses sem organizar.
              </p>
            </section>
            <section>
              <h2>Separação de Gastos Fixos e Variáveis</h2>
              <p>
                Separar gastos fixos de variáveis é fundamental para organização financeira:
              </p>
              <h3>Gastos Fixos</h3>
              <p>
                Gastos que não mudam (ou mudam pouco) todo mês: aluguel, financiamento, plano de
                saúde, escola dos filhos, internet, telefone fixo, assinaturas recorrentes.
              </p>
              <p>
                <strong>Características:</strong> Você sabe exatamente quanto será, quando será
                cobrado, não pode ser cortado facilmente sem mudança de estilo de vida.
              </p>
              <h3>Gastos Variáveis</h3>
              <p>
                Gastos que mudam de mês para mês: alimentação (supermercado + restaurantes),
                transporte (combustível ou transporte público), lazer, compras, presentes,
                imprevistos.
              </p>
              <p>
                <strong>Características:</strong> Valores flutuam, você tem mais controle sobre
                eles, são onde você pode economizar quando necessário.
              </p>
              <h3>Por Que Separar?</h3>
              <ul>
                <li>
                  <strong>Planejamento realista:</strong> Você sabe quanto tem disponível após
                  pagar os fixos
                </li>
                <li>
                  <strong>Priorização:</strong> Fixos são prioritários, variáveis podem ser
                  ajustados
                </li>
                <li>
                  <strong>Análise:</strong> Você pode analisar se gastos fixos estão muito altos
                  (talvez precise reduzir aluguel) ou se variáveis estão descontrolados
                </li>
              </ul>
            </section>
            <section>
              <h2>Visualização de Despesas</h2>
              <p>
                Organização financeira eficiente requer visualização clara. Números em planilha são
              </p>
              <h3>Gráfico de Pizza (Por Categoria)</h3>
              <p>
                Mostra visualmente qual porcentagem do orçamento vai para cada categoria:
                alimentação, transporte, moradia, lazer. Você vê imediatamente se uma categoria está
                consumindo muito do orçamento.
              </p>
              <h3>Gráfico de Barras (Comparação Mensal)</h3>
              <p>
                Compara seus gastos entre meses diferentes. Você identifica se está gastando mais
                ou menos do que meses anteriores, e em quais categorias.
              </p>
              <h3>Linha do Tempo</h3>
              <p>
                Mostra seus gastos ao longo do tempo. Identifica padrões sazonais (gastos maiores
                em dezembro, por exemplo) ou tendências (gastos aumentando ou diminuindo).
              </p>
              <p>
                Ferramentas de{' '}
                <InternalLink to="/gestao-financeira-cpf" className="hover:text-brand-arrow transition-colors">gestão financeira</InternalLink>{' '}
                automatizada geram esses gráficos automaticamente, economizando tempo e fornecendo
                insights visuais imediatos.
              </p>
            </section>
            <section>
              <h2>Disciplina Financeira Baseada em Dados</h2>
              <p>
                Disciplina financeira não vem de força de vontade, vem de hábitos baseados em dados:
              </p>
              <h3>Dados Reais vs. Estimativas</h3>
              <p>
                Quando você tem dados reais sobre seus gastos, decisões ficam mais fáceis. Ao invés
                de &quot;acho que gasto muito em restaurantes&quot;, você sabe: &quot;gasto R$ 800
                por mês em restaurantes, que é 20% do meu orçamento&quot;. Com dados, você decide
                racionalmente, não emocionalmente.
              </p>
              <h3>Metas Baseadas em Realidade</h3>
              <p>
                Metas financeiras devem ser baseadas em dados históricos. Se você gasta R$ 2000 em
                alimentação por mês, não faz sentido criar uma meta de R$ 800. Uma meta de R$ 1500
                é mais realista e alcançável.
              </p>
              <h3>Regras Automáticas</h3>
              <p>
                Com organização financeira automatizada, você pode criar regras. Por exemplo:
                &quot;se gastar mais de R$ 500 em lazer no mês, me avise&quot;. Regras automáticas
                ajudam a manter disciplina sem depender de memória ou força de vontade.
              </p>
              <h3>Revisão Periódica</h3>
              <p>
                Disciplina vem de revisão constante. Revise seus gastos semanalmente ou
                quinzenalmente. Não precisa mudar nada, apenas observe. O simples ato de revisar
                regularmente aumenta consciência e reduz gastos impulsivos.
              </p>
            </section>
            <section>
              <h2>Como Criar um Sistema de Organização Financeira</h2>
              <ol>
                <li>
                  <strong>Registre tudo por um mês:</strong> Antes de organizar, você precisa de
                  dados. Registre todas as receitas e despesas por um mês completo
                </li>
                <li>
                  <strong>Categorize:</strong> Separe gastos em categorias claras (alimentação,
                  transporte, moradia, lazer, etc.)
                </li>
                <li>
                  <strong>Identifique fixos e variáveis:</strong> Separe o que é fixo do que é
                  variável
                </li>
                <li>
                  <strong>Crie orçamento:</strong> Com dados reais, crie um orçamento mensal
                  realista
                </li>
                <li>
                  <strong>Use ferramenta visual:</strong> Escolha uma ferramenta que mostre seus
                  dados visualmente (gráficos, categorias)
                </li>
                <li>
                  <strong>Revise regularmente:</strong> Estabeleça rotina de revisão (semanal ou
                  quinzenal)
                </li>
                <li>
                  <strong>Ajuste:</strong> Ajuste orçamento e comportamento baseado em dados, não
                  em intuição
                </li>
              </ol>
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
                  <InternalLink to="/gestao-financeira-cpf/controle-financeiro-pessoal">
                    Controle Financeiro Pessoal
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