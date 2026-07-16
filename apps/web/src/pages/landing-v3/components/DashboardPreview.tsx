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

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto md:max-w-none">
      <div className="rounded-2xl shadow-2xl border border-gray-800 bg-[#1f2937] overflow-hidden text-left">
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-700/80 bg-[#111827]">
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
        </div>

        <div className="px-5 py-4 md:px-6 space-y-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Pilares
          </p>
          <ol>
            {PREVIEW_PILLARS.map((pillar, index) => (
              <li key={pillar.name} className="relative flex gap-3 pb-4 last:pb-0">
                <div className="relative flex w-3 shrink-0 flex-col items-center">
                  <span className="z-10 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-400 bg-[#1f2937]" />
                  {index < PREVIEW_PILLARS.length - 1 ? (
                    <span className="absolute top-4 bottom-0 w-px bg-gray-700" aria-hidden />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-[#111827]/90 px-3 py-2.5">
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
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-gray-700/80 px-5 py-3 bg-[#1f2937]">
          <p className="text-xs text-gray-500">
            Leitura progressiva — gráficos só depois da interpretação.
          </p>
        </div>
      </div>
    </div>
  );
}
