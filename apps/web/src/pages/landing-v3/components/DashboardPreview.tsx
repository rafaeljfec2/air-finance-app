import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { V3_EASE } from './motion';

const PREVIEW_PILLARS = [
  { name: 'Liquidez', state: 'Boa', value: 'R$ 12.400', question: 'Consigo operar agora?' },
  { name: 'Fluxo', state: 'Excelente', value: 'R$ 3.200', question: 'O ciclo gera folga?' },
  {
    name: 'Estrutura',
    state: 'Atenção',
    value: '42%',
    question: 'Quão rígido é o sistema?',
  },
] as const;

interface DashboardPreviewProps {
  readonly animateOnMount?: boolean;
}

export function DashboardPreview({ animateOnMount = false }: DashboardPreviewProps) {
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
          className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-700/80 bg-[#111827]"
          initial={reduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={reduced ? { duration: 0.01 } : { duration: 0.4, delay: 0.12, ease: V3_EASE }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Capacidade · check-up
          </p>
          <p className="text-sm font-semibold text-gray-50 leading-snug mb-3">
            Qual é a capacidade financeira do meu sistema?
          </p>
          <div className="space-y-1.5 text-sm text-gray-300 leading-relaxed">
            <p>Hoje seu sistema possui boa capacidade operacional.</p>
            <p>A principal tensão está na Estrutura.</p>
            <p className="text-gray-500">Os demais pilares sustentam essa capacidade.</p>
          </div>
        </motion.div>

        <div className="px-5 py-4 md:px-6 space-y-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Pilares
          </p>
          <ol>
            {PREVIEW_PILLARS.map((pillar, index) => (
              <motion.li
                key={pillar.name}
                className="relative flex gap-3 pb-4 last:pb-0"
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                animate={
                  active
                    ? reduced
                      ? { opacity: 1 }
                      : { opacity: 1, x: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: -12 }
                }
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : {
                        duration: 0.45,
                        delay: 0.28 + index * 0.12,
                        ease: V3_EASE,
                      }
                }
              >
                <div className="relative flex w-3 shrink-0 flex-col items-center">
                  <span className="z-10 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-400 bg-[#1f2937]" />
                  {index < PREVIEW_PILLARS.length - 1 ? (
                    <motion.span
                      className="absolute top-4 bottom-0 w-px bg-emerald-500/40 origin-top"
                      aria-hidden
                      initial={reduced ? false : { scaleY: 0 }}
                      animate={active ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={
                        reduced
                          ? { duration: 0.01 }
                          : {
                              duration: 0.4,
                              delay: 0.4 + index * 0.12,
                              ease: V3_EASE,
                            }
                      }
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-[#111827]/90 px-3 py-2.5 transition-colors duration-200 hover:border-emerald-500/40">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-50">{pillar.name}</span>
                    <span className="text-[10px] font-medium text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                      {pillar.state}
                    </span>
                  </div>
                  <p className="text-base font-bold tabular-nums text-gray-50">{pillar.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pillar.question}</p>
                  <p className="text-[11px] font-medium text-emerald-400 mt-1.5">Explorar</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="border-t border-gray-700/80 px-5 py-3 bg-[#1f2937]">
          <p className="text-xs text-gray-500">
            Leitura progressiva — gráficos só depois da interpretação.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
