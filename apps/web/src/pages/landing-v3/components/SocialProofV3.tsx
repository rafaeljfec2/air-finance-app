import { Shield } from 'lucide-react';
import { ScrollReveal } from './animations';

const BANKS = [
  'Nubank',
  'Inter',
  'Itaú',
  'Bradesco',
  'C6 Bank',
  'Santander',
  'Banco do Brasil',
  'Caixa',
] as const;

export function SocialProofV3() {
  return (
    <section className="py-8 md:py-12 bg-gray-50 border-y border-gray-100">
      <ScrollReveal variant="fade" duration={0.6}>
        <div className="v3-container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium shrink-0">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Compatível com os principais bancos do Brasil</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {BANKS.map((bank) => (
                <span
                  key={bank}
                  className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-400 font-medium">
              Via Open Finance, regulado pelo Banco Central do Brasil
            </span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
