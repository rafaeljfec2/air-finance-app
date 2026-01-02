import { SEOHead } from '@/components/seo/SEOHead';
import { InternalLink } from '@/components/seo/InternalLink';
import { ChevronRight, Home } from 'lucide-react';
import { Header } from '@/pages/landing/components/Header';
import { Footer } from '@/pages/landing/components/Footer';

export function IntegracaoBancariaCNPJPage() {
  const faqItems = [
    {
      question: 'O que é integração bancária para CNPJ?',
      answer:
        'Integração bancária para CNPJ é a conexão automática entre sistemas de gestão empresarial e bancos, permitindo importação automática de extratos, conciliação de transações e sincronização de dados financeiros sem intervenção manual.',
    },
    {
      question: 'Qual a diferença entre extrato manual e integração via API?',
      answer:
        'Extrato manual requer download de arquivos (OFX, CSV), importação manual e conciliação feita pessoa a pessoa. Integração via API automatiza todo o processo: os dados chegam em tempo real, são processados automaticamente e conciliados sem intervenção humana.',
    },
    {
      question: 'O Open Banking funciona para empresas?',
      answer:
        'Sim. O Open Banking permite que empresas autorizem o compartilhamento de dados bancários com sistemas terceiros através de APIs seguras. Isso facilita a integração bancária, permitindo acesso automático a extratos e informações financeiras.',
    },
    {
      question: 'Como funciona a conciliação bancária automática?',
      answer:
        'A conciliação automática compara transações bancárias importadas com lançamentos contábeis, identificando correspondências por valor, data e descrição. Transações não encontradas são destacadas para revisão, reduzindo drasticamente o tempo de conciliação.',
    },
    {
      question: 'Quais os riscos de segurança na integração bancária?',
      answer:
        'Os principais riscos são: exposição de credenciais bancárias, violação de dados por sistemas terceiros e não conformidade com LGPD. Soluções seguras usam OAuth, criptografia de ponta a ponta, armazenamento seguro de tokens e compliance com regulamentações.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Integração Bancária CNPJ: API e Open Banking para Empresas"
        description="Integração bancária automatizada para empresas. Open Banking CNPJ, conciliação automática, integração com ERP e API bancária. Segurança, LGPD e benefícios para contabilidade."
        canonical="https://airfinance.com.br/integracao-bancaria-cnpj"
        articleSchema={{
          headline: 'Integração Bancária CNPJ: API e Open Banking para Empresas',
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
                <span className="text-text font-medium">Integração Bancária CNPJ</span>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-4xl px-6 py-12 pb-24">
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text dark:prose-headings:text-text prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-text/80 dark:prose-p:text-text/80 prose-p:leading-relaxed prose-a:text-brand-arrow prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-text dark:prose-strong:text-text prose-strong:font-semibold prose-li:text-text/80 dark:prose-li:text-text/80 prose-ul:text-text/80 dark:prose-ul:text-text/80 prose-ol:text-text/80 dark:prose-ol:text-text/80 prose-li:my-2">
            <h1>Integração Bancária CNPJ: Automatize a Gestão Financeira Empresarial</h1>

            <section className="mb-12">
                <div className="prose-lg text-text/90 leading-relaxed bg-brand-arrow/5 rounded-xl p-6 border-l-4 border-brand-arrow">
                  <p className="m-0 text-lg font-medium">
                    Integração bancária para empresas elimina trabalho manual de importação de
                extratos, conciliação e sincronização de dados. Este guia técnico explica como
                funciona, tecnologias envolvidas, benefícios e cuidados de segurança.
                  </p>
                </div>
              </section>

            <section>
              <h2>O Que é Integração Bancária para CNPJ</h2>
              <p>
                Integração bancária empresarial é a conexão automatizada entre sistemas de gestão
                (ERP, plataformas financeiras) e instituições bancárias, permitindo:
              </p>
              <ul>
                <li>Importação automática de extratos bancários</li>
                <li>Sincronização de saldos e movimentações em tempo real</li>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/conciliacao-bancaria-automatica">
                    Conciliação bancária automática
                  </InternalLink>
                </li>
                <li>Reconciliação com lançamentos contábeis</li>
                <li>Geração automática de relatórios financeiros</li>
              </ul>
              <p>
                Esta automação reduz erros humanos, economiza tempo da equipe financeira e fornece
                dados atualizados para tomada de decisão.
              </p>
            </section>

            <section>
              <h2>Diferença Entre Extrato Manual e Integração via API</h2>

              <h3>Processo Manual Tradicional</h3>
              <ol>
                <li>Download de extrato bancário (OFX, CSV ou PDF)</li>
                <li>Importação manual no sistema de gestão</li>
                <li>Conciliação manual transação por transação</li>
                <li>Identificação de divergências pessoa a pessoa</li>
                <li>Correção de erros manualmente</li>
              </ol>
              <p>
                <strong>Problemas:</strong> Demorado, sujeito a erros, não escala, dados
                desatualizados.
              </p>

              <h3>Integração via API</h3>
              <ol>
                <li>
                  Conexão automática com banco via{' '}
                  <InternalLink to="/integracao-bancaria-cnpj/open-banking-cnpj">
                    Open Banking
                  </InternalLink>{' '}
                  ou API proprietária
                </li>
                <li>Importação automática de transações em tempo real</li>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/conciliacao-bancaria-automatica">
                    Conciliação automática
                  </InternalLink>{' '}
                  com regras configuráveis
                </li>
                <li>Alertas automáticos para divergências</li>
                <li>Sugestões inteligentes para correções</li>
              </ol>
              <p>
                <strong>Benefícios:</strong> Rápido, preciso, escalável, dados sempre atualizados.
              </p>
            </section>

            <section>
              <h2>Open Banking Aplicado a Empresas</h2>
              <p>
                O Open Banking permite que empresas autorizem o compartilhamento seguro de dados
                bancários com sistemas terceiros através de APIs padronizadas. Para empresas:
              </p>

              <h3>Autorização e Consentimento</h3>
              <p>
                A empresa autoriza explicitamente o acesso aos dados bancários. A autorização pode
                ser revogada a qualquer momento. Os dados são compartilhados apenas com empresas
                credenciadas pelo Banco Central.
              </p>

              <h3>Escopo de Dados Compartilhados</h3>
              <ul>
                <li>Extratos bancários e histórico de transações</li>
                <li>Saldos de contas correntes e aplicações</li>
                <li>Informações de produtos e serviços bancários</li>
                <li>Dados cadastrais (com restrições)</li>
              </ul>

              <h3>Benefícios para Empresas</h3>
              <ul>
                <li>Integração simplificada com múltiplos bancos</li>
                <li>Padrão único de API (reduz complexidade técnica)</li>
                <li>Maior controle sobre compartilhamento de dados</li>
                <li>Conformidade regulatória nativa</li>
              </ul>
            </section>

            <section>
              <h2>Conciliação Bancária Automática</h2>
              <p>
                A conciliação automática compara transações bancárias importadas com lançamentos
                contábeis, identificando correspondências através de:
              </p>
              <ul>
                <li>
                  <strong>Correspondência por valor e data:</strong> Transações com mesmo valor e
                  data próxima são automaticamente relacionadas
                </li>
                <li>
                  <strong>Correspondência por descrição:</strong> IA identifica padrões em
                  descrições de transações
                </li>
                <li>
                  <strong>Regras configuráveis:</strong> Regras personalizadas por empresa para
                  casos específicos
                </li>
              </ul>
              <p>
                Transações não conciliadas são destacadas para revisão, permitindo que a equipe
                financeira foque apenas em exceções.
              </p>
            </section>

            <section>
              <h2>Benefícios para Contabilidade, Financeiro e Fluxo de Caixa</h2>

              <h3>Para a Contabilidade</h3>
              <ul>
                <li>Redução de tempo em conciliações (de horas para minutos)</li>
                <li>Maior precisão nos lançamentos contábeis</li>
                <li>Auditoria facilitada com rastreabilidade completa</li>
                <li>Conformidade com obrigações fiscais</li>
              </ul>

              <h3>Para o Financeiro</h3>
              <ul>
                <li>Visão em tempo real do caixa</li>
                <li>Alertas automáticos de vencimentos e saldos</li>
                <li>Planejamento financeiro baseado em dados reais</li>
                <li>Redução de erros operacionais</li>
              </ul>

              <h3>Para Fluxo de Caixa</h3>
              <ul>
                <li>Projeções mais precisas com dados atualizados</li>
                <li>Identificação rápida de gargalos</li>
                <li>Análise de tendências e sazonalidade</li>
                <li>Otimização de capital de giro</li>
              </ul>
            </section>

            <section>
              <h2>Riscos e Cuidados: Segurança e LGPD</h2>

              <h3>Segurança de Dados</h3>
              <ul>
                <li>
                  <strong>Criptografia:</strong> Dados devem ser criptografados em trânsito (HTTPS)
                  e em repouso
                </li>
                <li>
                  <strong>Autenticação:</strong> Uso de OAuth 2.0 e tokens com expiração, nunca
                  senhas bancárias
                </li>
                <li>
                  <strong>Acesso mínimo:</strong> Sistemas devem solicitar apenas permissões
                  necessárias
                </li>
                <li>
                  <strong>Monitoramento:</strong> Logs de acesso e alertas de atividades
                  suspeitas
                </li>
              </ul>

              <h3>Conformidade LGPD</h3>
              <ul>
                <li>Autorização explícita da empresa para compartilhamento</li>
                <li>Transparência sobre quais dados são coletados e como são usados</li>
                <li>Direito de revogação a qualquer momento</li>
                <li>Armazenamento seguro e exclusão de dados quando solicitado</li>
                <li>Política de privacidade clara e acessível</li>
              </ul>

              <h3>Recomendações</h3>
              <ul>
                <li>Escolher fornecedores com certificações de segurança (ISO 27001, SOC 2)</li>
                <li>Revisar contratos de processamento de dados (LGPD)</li>
                <li>Implementar controles de acesso baseados em função</li>
                <li>Realizar auditorias regulares de segurança</li>
                <li>Ter plano de resposta a incidentes</li>
              </ul>
            </section>

            <section>
              <h2>Integração com ERP</h2>
              <p>
                <InternalLink to="/integracao-bancaria-cnpj/integracao-erp-api-bancaria">
                  A integração bancária pode conectar-se a ERPs
                </InternalLink>{' '}
                através de APIs, permitindo sincronização bidirecional:
              </p>
              <ul>
                <li>Extratos bancários → Lançamentos contábeis</li>
                <li>Pagamentos aprovados → Baixa automática de contas a pagar</li>
                <li>Recebimentos → Atualização de contas a receber</li>
                <li>Dados bancários → Relatórios financeiros</li>
              </ul>
            </section>

            <section>
              <h2>Links Relacionados</h2>
              <ul>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/integracao-bancaria-empresas">
                    Integração Bancária para Empresas: Guia Completo
                  </InternalLink>
                </li>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/open-banking-cnpj">
                    Open Banking para CNPJ: Como Funciona
                  </InternalLink>
                </li>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/conciliacao-bancaria-automatica">
                    Conciliação Bancária Automática
                  </InternalLink>
                </li>
                <li>
                  <InternalLink to="/integracao-bancaria-cnpj/integracao-erp-api-bancaria">
                    Integração ERP com API Bancária
                  </InternalLink>
                </li>
              </ul>
            </section>

            <section>
              <h2>Perguntas Frequentes</h2>
              {faqItems.map((item, index) => (
                <div key={index} className="mb-6">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>

              <section className="mt-16 border-t border-border pt-12">
                <div className="bg-gradient-to-r from-brand-arrow/5 to-transparent rounded-2xl p-8 border border-border/50">
                  <p className="text-text/80 mb-6 text-lg">
                    Pronto para automatizar a gestão financeira da sua empresa?
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
