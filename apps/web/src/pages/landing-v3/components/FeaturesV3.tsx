import { Landmark, Brain, Target, BarChart3, FileSpreadsheet, Building2 } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

const FEATURES = [
  {
    icon: Landmark,
    title: 'Todas as contas em um lugar',
    description:
      'Conecte bancos, cartões e contas digitais. Veja seu saldo consolidado em tempo real, sem alternar entre apps.',
  },
  {
    icon: Brain,
    title: 'Categorização automática com IA',
    description:
      'Cada transação é categorizada sem você tocar em nada. Supermercado, combustível, restaurante — a IA aprende com você.',
  },
  {
    icon: Target,
    title: 'Metas que acompanham você',
    description:
      'Defina quanto quer economizar e acompanhe o progresso. O Airfinance mostra se você está no caminho certo.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios que fazem sentido',
    description:
      'Veja para onde vai seu dinheiro por categoria, período ou conta. Identifique padrões e tome decisões melhores.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Importação via OFX',
    description:
      'Prefere não conectar via Open Finance? Importe seus extratos bancários em OFX. Você escolhe como usar.',
  },
  {
    icon: Building2,
    title: 'Multi-empresa',
    description:
      'Gerencie finanças pessoais e da empresa no mesmo lugar. Cada CNPJ com suas próprias contas e relatórios.',
  },
] as const;

export function FeaturesV3() {
  return (
    <section id="features" className="v3-section bg-white">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">Recursos</div>
          <h2 className="v3-h2 mb-4">O que você ganha com o Airfinance</h2>
          <p className="v3-body max-w-2xl mx-auto">
            Funcionalidades pensadas para quem quer controle real das finanças, sem complicação.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.08}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <div className="v3-card group h-full">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
