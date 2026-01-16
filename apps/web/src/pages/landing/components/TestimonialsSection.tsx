import { Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { InteractiveCard } from './InteractiveCard';

const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    role: 'Empreendedora',
    avatar: '👩‍💼',
    rating: 5,
    text: 'O Airfinance transformou completamente minha gestão financeira. Agora tenho controle total e consigo tomar decisões muito mais informadas.',
  },
  {
    id: 2,
    name: 'João Santos',
    role: 'Analista Financeiro',
    avatar: '👨‍💻',
    rating: 5,
    text: 'A interface é intuitiva e os relatórios são extremamente detalhados. Recomendo para qualquer pessoa que queira organizar suas finanças.',
  },
  {
    id: 3,
    name: 'Ana Costa',
    role: 'Freelancer',
    avatar: '👩‍🎨',
    rating: 5,
    text: 'Como freelancer, preciso controlar cada centavo. O Airfinance me ajuda a visualizar minha situação financeira de forma clara e objetiva.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-background to-white relative z-10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-arrow">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-text/80 max-w-3xl mx-auto">
            Milhares de pessoas já transformaram suas finanças com o Airfinance
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} variant="slideUp" delay={index * 0.2}>
              <InteractiveCard>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-brand-arrow text-brand-arrow"
                        aria-label={`${testimonial.rating} estrelas`}
                      />
                    ))}
                  </div>
                  <p className="text-text/80 mb-6 flex-grow italic">&quot;{testimonial.text}&quot;</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-brand-arrow/10 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-arrow">{testimonial.name}</p>
                      <p className="text-sm text-text/60">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

