import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { V3_EASE } from './motion';

const TEASER_LINES = [
  'Fluxo sustenta a capacidade operacional.',
  'Estrutura merece atenção neste momento.',
  'Liquidez confortável para o curto prazo.',
] as const;

interface DashboardPreviewProps {
  readonly animateOnMount?: boolean;
  /** When true, shows “Ver o check-up completo” → /register (curiosity CTA). */
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
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Capacidade financeira
            </p>
            <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full">
              Boa
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-50 leading-snug mb-4">
            Qual é a capacidade financeira do meu sistema?
          </p>

          <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed">
            {TEASER_LINES.map((line, index) => (
              <motion.li
                key={line}
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
                    : { duration: 0.4, delay: 0.22 + index * 0.1, ease: V3_EASE }
                }
              >
                {line}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {showCheckupCta ? (
          <div className="border-t border-gray-700/80 px-5 py-4 bg-[#1f2937]">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              aria-label="Ver o check-up completo"
            >
              Ver o check-up completo
              <ChevronDown className="w-4 h-4" />
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
