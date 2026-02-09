import { CreditCard, ClipboardList, HelpCircle } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const PROBLEMS = [
  {
    icon: CreditCard,
    title: 'Contas espalhadas',
    description:
      'Nubank, Inter, banco do salário. Cada um com seu app, seu extrato, seus números. Nenhum mostra o todo.',
  },
  {
    icon: ClipboardList,
    title: 'Controle manual cansa',
    description:
      'Você já tentou a planilha. Funcionou por 10 dias. Depois, a vida aconteceu e você parou de preencher.',
  },
  {
    icon: HelpCircle,
    title: 'Sem visão real',
    description:
      'Chega no fim do mês sem saber para onde foi o dinheiro. Quanto gastou em alimentação? Transporte? Impossível dizer.',
  },
] as const;

export function ProblemV3() {
  return (
    <section className="v3-section bg-white">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="v3-h2 mb-4">
            Você sabe quanto gastou
            <br className="hidden sm:block" />
            <span className="text-gray-400"> no mês passado?</span>
          </h2>
          <p className="v3-body max-w-2xl mx-auto">
            A maioria não sabe. Contas em bancos diferentes, cartões de crédito espalhados, Pix que
            some sem você perceber. O resultado: você desiste e continua no escuro.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          staggerDelay={0.12}
        >
          {PROBLEMS.map((problem) => {
            const Icon = problem.icon;
            return (
              <StaggerItem key={problem.title}>
                <div className="v3-card text-center group h-full">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{problem.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
