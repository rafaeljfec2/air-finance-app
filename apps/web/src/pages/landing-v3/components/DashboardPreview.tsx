import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { V3_EASE } from './motion';

/** Compact pillar hints — names + state only; no values or deep copy. */
const TEASER_PILLARS = [
  { name: 'Fluxo', state: 'Sustenta' },
  { name: 'Estrutura', state: 'Atenção' },
  { name: 'Liquidez', state: 'Confortável' },
] as const;

interface DashboardPreviewProps {
  readonly animateOnMount?: boolean;
  /** When true, shows curiosity CTA → /register. */
  readonly showCheckupCta?: boolean;
}

export function DashboardPreview({
  animateOnMount = false,
  showCheckupCta = false,
}: DashboardPreviewProps) {
  const navigate = useNavigate();
  const reduced = useReducedMotion() === true;
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const active = animateOnMount || inView;

  return (
    <div ref={ref} className="relative w-full max-w-lg mx-auto md:max-w-none">
      <motion.div
        className="rounded-2xl shadow-2xl border border-gray-800 bg-[#1f2937] overflow-hidden text-left"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        animate={
          active
            ? reduced
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
            : reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 16, scale: 0.98 }
        }
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 0.6, ease: V3_EASE, delay: animateOnMount ? 0.05 : 0 }
        }
      >
        <motion.div
          className="px-5 py-5 md:px-6 md:py-6 bg-[#111827]"
          initial={reduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={reduced ? { duration: 0.01 } : { duration: 0.4, delay: 0.12, ease: V3_EASE }}
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Capacidade financeira
            </p>
            <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full">
              Boa
            </span>
          </div>

          <ul className="space-y-2 mb-5">
            {TEASER_PILLARS.map((pillar, index) => (
              <motion.li
                key={pillar.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-700/80 bg-[#1f2937]/80 px-3 py-2.5"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={
                  active
                    ? reduced
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 8 }
                }
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.35, delay: 0.2 + index * 0.08, ease: V3_EASE }
                }
              >
                <span className="text-sm font-medium text-gray-50">{pillar.name}</span>
                <span className="text-[11px] font-medium text-gray-400">{pillar.state}</span>
              </motion.li>
            ))}
          </ul>

          <p className="text-sm text-gray-400 leading-relaxed">
            O sistema sustenta o curto prazo. Há um ponto que merece um olhar mais perto.
          </p>
        </motion.div>

        {showCheckupCta ? (
          <div className="border-t border-gray-700/80 px-5 py-4 bg-[#1f2937]">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
              aria-label="Ver a análise completa"
            >
              Quero ver a análise completa
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-700/80 px-5 py-3 bg-[#1f2937]">
            <p className="text-xs text-gray-500 text-center">Exemplo ilustrativo — não é o seu.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
