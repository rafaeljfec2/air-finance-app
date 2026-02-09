import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem, Collapse } from './animations';

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

const FAQ_ITEMS: readonly FAQItem[] = [
  {
    question: 'O que é Open Finance?',
    answer:
      'Open Finance é um sistema regulado pelo Banco Central do Brasil que permite compartilhar seus dados financeiros entre instituições de forma segura. Com ele, o Airfinance acessa seus extratos bancários automaticamente, sem que você precise digitar nada.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Sim. Toda a comunicação é feita via Open Finance, que é regulado e fiscalizado pelo Banco Central. Usamos criptografia em todas as conexões e seguimos a LGPD. Não armazenamos suas credenciais bancárias.',
  },
  {
    question: 'Posso usar sem conectar meu banco?',
    answer:
      'Sim. Você pode importar seus extratos bancários manualmente em formato OFX, que é o padrão usado pela maioria dos bancos brasileiros. A conexão via Open Finance é opcional.',
  },
  {
    question: 'O beta é realmente grátis?',
    answer:
      'Sim. Durante a fase beta, todos os planos estão disponíveis gratuitamente. Não pedimos cartão de crédito. Quando o beta encerrar, você será avisado com antecedência e poderá escolher seu plano.',
  },
  {
    question: 'Funciona com quais bancos?',
    answer:
      'Funcionamos com os principais bancos do Brasil via Open Finance: Nubank, Inter, Itaú, Bradesco, Santander, C6 Bank, Banco do Brasil, Caixa, entre outros. A lista cresce conforme mais bancos aderem ao Open Finance.',
  },
  {
    question: 'Como a IA categoriza minhas transações?',
    answer:
      'Nossa IA analisa a descrição de cada transação e a classifica automaticamente (ex: supermercado, transporte, restaurante). Ela aprende com suas correções, ficando mais precisa com o tempo.',
  },
] as const;

function FAQAccordionItem({ item }: { readonly item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-semibold text-gray-900 pr-4 group-hover:text-emerald-600 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <Collapse isOpen={isOpen}>
        <p className="text-sm text-gray-500 leading-relaxed pr-8 pb-5">{item.answer}</p>
      </Collapse>
    </div>
  );
}

export function FAQV3() {
  return (
    <section className="v3-section bg-white">
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
