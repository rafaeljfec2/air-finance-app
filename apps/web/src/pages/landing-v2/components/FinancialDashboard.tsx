import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export function FinancialDashboard() {
  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        <div className="bg-gradient-to-br from-[#f0fdf4] via-white to-white p-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Saldo Total</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-bold text-gray-900">R$ 12.450</span>
                <span className="text-2xl font-semibold text-gray-500">,00</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-8 bg-gradient-to-br from-green-50 to-green-100/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-700">Receitas</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-semibold">+12%</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-700">R$ 15.000</span>
              <span className="text-2xl font-semibold text-green-600">,00</span>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-red-50 to-red-100/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-red-700">Despesas</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-700">R$ 2.550</span>
              <span className="text-2xl font-semibold text-red-600">,00</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-3 -right-3 w-full h-full bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-3xl -z-10 blur-2xl" />
      <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-gray-100/80 to-gray-50/80 rounded-3xl -z-20" />
    </div>
  );
}
