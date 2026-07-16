import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { ScrollReveal, StaggerContainer, StaggerItem, Collapse } from './animations';

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

const FAQ_ITEMS: readonly FAQItem[] = [
  {
    question: 'O que torna o AirFinance diferente?',
    answer:
      'O AirFinance não mostra apenas números. Ele interpreta como o seu sistema financeiro funciona — as relações entre as partes até a capacidade. Isso é o Check-up Financeiro.',
  },
  {
    question: 'O que muda na minha vida financeira?',
    answer:
      'Você passa a compreender a capacidade do sistema e o que merece atenção — e decide com menos incerteza. Sem score e sem o produto decidir por você.',
  },
  {
    question: 'Open Finance e IA são o produto?',
    answer:
      'Não. São meios: ajudam a reunir e organizar dados. O posicionamento do AirFinance é interpretar o sistema e entregar compreensão — o Check-up Financeiro.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Sim. Quando você conecta bancos, a comunicação usa Open Finance (regulado pelo Banco Central), com criptografia e respeito à LGPD. Não armazenamos suas credenciais bancárias.',
  },
  {
    question: 'Preciso conectar meu banco?',
    answer:
      'Não é obrigatório. Você pode começar importando extratos em OFX. Conectar bancos acelera o caminho até o Check-up — é opcional.',
  },
  {
    question: 'O beta é realmente grátis?',
    answer:
      'Sim. Durante a fase beta, todos os planos estão disponíveis gratuitamente. Não pedimos cartão de crédito. Quando o beta encerrar, você será avisado com antecedência e poderá escolher seu plano.',
  },
] as const;

function FAQAccordionItem({ item }: { readonly item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-semibold text-gray-50 pr-4 group-hover:text-emerald-400 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <Collapse isOpen={isOpen}>
        <p className="text-sm text-gray-400 leading-relaxed pr-8 pb-5">{item.answer}</p>
      </Collapse>
    </div>
  );
}

export function FAQV3() {
  return (
    <section className="v3-section bg-[var(--v3-bg)]">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="v3-h2 mb-4">Perguntas frequentes</h2>
          <p className="v3-body max-w-xl mx-auto">
            O essencial para você começar com clareza — sem jargão de produto.
          </p>
        </ScrollReveal>

        <StaggerContainer className="max-w-2xl mx-auto" staggerDelay={0.06}>
          {FAQ_ITEMS.map((item) => (
            <StaggerItem key={item.question} variant="fade">
              <FAQAccordionItem item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
