import { Check, X, Minus } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './animations';

interface ComparisonRow {
  readonly feature: string;
  readonly airfinance: 'yes' | 'no' | 'partial';
  readonly spreadsheet: 'yes' | 'no' | 'partial';
  readonly bankApp: 'yes' | 'no' | 'partial';
  readonly otherApps: 'yes' | 'no' | 'partial';
}

const COMPARISON_DATA: readonly ComparisonRow[] = [
  {
    feature: 'Multi-banco real',
    airfinance: 'yes',
    spreadsheet: 'partial',
    bankApp: 'no',
    otherApps: 'partial',
  },
  {
    feature: 'Open Finance',
    airfinance: 'yes',
    spreadsheet: 'no',
    bankApp: 'no',
    otherApps: 'partial',
  },
  {
    feature: 'IA categoriza',
    airfinance: 'yes',
    spreadsheet: 'no',
    bankApp: 'partial',
    otherApps: 'partial',
  },
  {
    feature: 'Import OFX',
    airfinance: 'yes',
    spreadsheet: 'no',
    bankApp: 'no',
    otherApps: 'partial',
  },
  {
    feature: 'Multi-empresa',
    airfinance: 'yes',
    spreadsheet: 'no',
    bankApp: 'no',
    otherApps: 'no',
  },
  {
    feature: 'Metas financeiras',
    airfinance: 'yes',
    spreadsheet: 'partial',
    bankApp: 'partial',
    otherApps: 'partial',
  },
  {
    feature: 'Relatórios avançados',
    airfinance: 'yes',
    spreadsheet: 'partial',
    bankApp: 'partial',
    otherApps: 'partial',
  },
] as const;

const COLUMNS = ['Airfinance', 'Planilha', 'App do banco', 'Outros apps'] as const;

function StatusIcon({ status }: { readonly status: 'yes' | 'no' | 'partial' }) {
  switch (status) {
    case 'yes':
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      );
    case 'no':
      return (
        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-red-400" />
        </div>
      );
    case 'partial':
      return (
        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
          <Minus className="w-3.5 h-3.5 text-amber-500" />
        </div>
      );
  }
}

export function ComparisonV3() {
  return (
    <section className="v3-section v3-section-dark">
      <div className="v3-container">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <div className="v3-badge v3-badge-dark mx-auto mb-4">Comparativo</div>
          <h2 className="v3-h2 mb-4">Por que o Airfinance?</h2>
          <p className="v3-body max-w-xl mx-auto">
            Veja como nos comparamos com as alternativas que você provavelmente já tentou.
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-[180px]" />
                {COLUMNS.map((col, index) => (
                  <th
                    key={col}
                    className={`py-3 px-4 text-center text-sm font-semibold ${
                      index === 0 ? 'text-emerald-400' : 'text-gray-400'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <StaggerContainer as-child staggerDelay={0.06}>
              <tbody>
                {COMPARISON_DATA.map((row) => (
                  <StaggerItem key={row.feature} variant="fade">
                    <tr className="border-t border-gray-800">
                      <td className="py-3.5 px-4 text-sm font-medium text-gray-300">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center">
                          <StatusIcon status={row.airfinance} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center">
                          <StatusIcon status={row.spreadsheet} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center">
                          <StatusIcon status={row.bankApp} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center">
                          <StatusIcon status={row.otherApps} />
                        </div>
                      </td>
                    </tr>
                  </StaggerItem>
                ))}
              </tbody>
            </StaggerContainer>
          </table>
        </div>
      </div>
    </section>
  );
}
