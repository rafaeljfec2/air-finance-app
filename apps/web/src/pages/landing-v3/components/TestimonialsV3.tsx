import { MessageSquare } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly content: string;
  readonly initials: string;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: 'Lucas M.',
    role: 'Freelancer',
    content:
      'Tinha contas no Nubank, Inter e Itaú. Nunca sabia quanto sobrava no mês. Com o Airfinance, conectei tudo e em 5 minutos vi meu saldo real.',
    initials: 'LM',
  },
  {
    name: 'Ana C.',
    role: 'Designer autônoma',
    content:
      'A categorização automática é o que me faz continuar usando. Não preciso lembrar de anotar nada. A IA acerta quase tudo.',
    initials: 'AC',
  },
  {
    name: 'Rafael S.',
    role: 'Empreendedor',
    content:
      'Uso o plano Business para separar as finanças da empresa das minhas. Antes misturava tudo. Agora tenho clareza total.',
    initials: 'RS',
  },
] as const;

export function TestimonialsV3() {
  return (
    <section className="v3-section bg-white">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge mx-auto mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Feedback de beta testers</span>
          </div>
          <h2 className="v3-h2 mb-4">Quem já usa, recomenda</h2>
          <p className="v3-body max-w-xl mx-auto">
            Estamos em beta. Veja o que nossos primeiros usuários estão dizendo.
          </p>
        </ScrollReveal>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          staggerDelay={0.12}
        >
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="v3-card flex flex-col h-full">
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      {testimonial.name}
                    </span>
                    <span className="text-xs text-gray-400">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
