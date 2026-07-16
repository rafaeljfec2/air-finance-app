import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { ScrollReveal, StaggerContainer, StaggerItem, Collapse } from './animations';

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

const FAQ_ITEMS: readonly FAQItem[] = [
  {
    question: 'O que o AirFinance faz de diferente?',
    answer:
      'Ele interpreta a capacidade do seu sistema financeiro — o que sustenta e o que merece atenção — para você decidir com menos incerteza. Não é um painel de saldos nem um score de “nota financeira”.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Sim. Quando você conecta bancos, a comunicação usa Open Finance (regulado pelo Banco Central), com criptografia e respeito à LGPD. Não armazenamos suas credenciais bancárias.',
  },
  {
    question: 'Preciso conectar meu banco?',
    answer:
      'Não é obrigatório. Você pode começar importando extratos em OFX. Conectar via Open Finance é opcional e acelera a leitura do sistema.',
  },
  {
    question: 'O beta é realmente grátis?',
    answer:
      'Sim. Durante a fase beta, todos os planos estão disponíveis gratuitamente. Não pedimos cartão de crédito. Quando o beta encerrar, você será avisado com antecedência e poderá escolher seu plano.',
  },
  {
    question: 'O produto decide por mim?',
    answer:
      'Não. O AirFinance aconselha e organiza a leitura. A decisão continua sendo sua — silêncio é o default, sem pressão artificial.',
  },
  {
    question: 'Funciona com quais bancos?',
    answer:
      'Com os principais bancos do Brasil via Open Finance: Nubank, Inter, Itaú, Bradesco, Santander, C6 Bank, Banco do Brasil, Caixa, entre outros. A lista cresce conforme mais bancos aderem.',
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
          <p className="v3-body max-w-xl mx-auto">Respostas rápidas para as dúvidas mais comuns.</p>
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
