import { Mail, MessageCircle } from 'lucide-react';

const CONTACT_EMAIL = 'contato@connexto.com.br';
const CONNEXTO_URL = 'https://www.connexto.com.br/';

export function ContactV2() {
  return (
    <section id="contact" className="v2-section bg-white border-t border-gray-100 relative">
      <div className="v2-container relative z-10">
        <div className="v2-text-center v2-mb-12">
          <h2 className="v2-h2 v2-mb-6">Fale conosco</h2>
          <p className="v2-body max-w-2xl mx-auto text-gray-600">
            Dúvidas, sugestões ou parcerias? Estamos à disposição.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 flex-wrap">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#ecfdf5] transition-all duration-200"
          >
            <Mail className="w-5 h-5 shrink-0" />
            <span>{CONTACT_EMAIL}</span>
          </a>
          <a
            href={CONNEXTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#ecfdf5] transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Connexto — Integração e suporte</span>
          </a>
        </div>
      </div>
    </section>
  );
}
