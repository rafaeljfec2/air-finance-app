import { Link2, Brain, LayoutDashboard } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const SOLUTIONS = [
  {
    icon: Link2,
    title: 'Conecte seus bancos',
    description:
      'Via Open Finance, regulado pelo Banco Central. Seus dados sincronizam automaticamente, sem digitar nada.',
    accent: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Brain,
    title: 'IA categoriza tudo',
    description:
      'Cada transação é categorizada automaticamente. Supermercado, combustível, restaurante. Sem esforço manual.',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Veja tudo no painel',
    description:
      'Saldo consolidado, receitas, despesas, metas. Tudo atualizado em um único lugar. Você só decide.',
    accent: 'from-violet-500 to-violet-600',
  },
] as const;

export function SolutionV3() {
  return (
    <section className="v3-section bg-gray-50">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Como resolvemos</div>
          <h2 className="v3-h2 mb-4">
            O Airfinance conecta, categoriza
            <br className="hidden sm:block" />e mostra.{' '}
            <span className="text-emerald-500">Você só decide.</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            Conecte suas contas bancárias em minutos. A inteligência artificial faz o resto. Você
            acompanha tudo em um painel claro e atualizado.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.12}
        >
          {SOLUTIONS.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <StaggerItem key={solution.title}>
                <div className="v3-card group h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${solution.accent} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase">
                      Passo {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{solution.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
