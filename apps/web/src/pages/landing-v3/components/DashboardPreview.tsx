import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, PieChart, Target } from 'lucide-react';

const CATEGORIES = [
  { name: 'Moradia', value: 'R$ 1.200', color: 'bg-emerald-500', width: '65%' },
  { name: 'Alimentação', value: 'R$ 890', color: 'bg-blue-500', width: '48%' },
  { name: 'Transporte', value: 'R$ 450', color: 'bg-amber-500', width: '24%' },
] as const;

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto md:max-w-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-50 to-white px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Saldo consolidado
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              R$ 12.450
            </span>
            <span className="text-lg md:text-xl font-semibold text-gray-400">,00</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">+8,2% vs mês anterior</span>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-4 py-3 md:px-5 md:py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Receitas</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-bold text-gray-900">R$ 8.500</span>
              <span className="text-sm font-semibold text-gray-400">,00</span>
            </div>
          </div>

          <div className="px-4 py-3 md:px-5 md:py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Despesas</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-bold text-gray-900">R$ 3.280</span>
              <span className="text-sm font-semibold text-gray-400">,00</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Top categorias</span>
            </div>
            <span className="text-xs text-gray-400">este mês</span>
          </div>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-20 shrink-0">{cat.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: cat.width }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-16 text-right shrink-0">
                  {cat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-700 block">
                  Reserva de emergência
                </span>
                <span className="text-xs text-gray-400">R$ 6.200 de R$ 10.000</span>
              </div>
            </div>
            <span className="text-sm font-bold text-violet-600">62%</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>
      </div>

      <div className="absolute -top-3 -right-3 w-full h-full bg-gradient-to-br from-emerald-100/60 to-transparent rounded-2xl -z-10 blur-xl" />
    </div>
  );
}
