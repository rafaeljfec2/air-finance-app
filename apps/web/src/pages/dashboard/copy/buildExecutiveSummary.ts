import type { CapacityState, FinancialHealthCheckup, FinancialHealthPillar } from '../types';
import { CAPACITY_STATE_LABEL } from '../types';

export interface ExecutiveSummaryLines {
  readonly capacityLine: string;
  readonly tensionLine: string;
  readonly supportLine: string;
}

const STATE_SEVERITY: Readonly<Record<CapacityState, number>> = {
  critical: 4,
  attention: 3,
  inconclusive: 2,
  good: 1,
  excellent: 0,
};

function pickPrimaryTension(pillars: readonly FinancialHealthPillar[]): FinancialHealthPillar {
  return pillars.reduce((worst, pillar) =>
    STATE_SEVERITY[pillar.state] > STATE_SEVERITY[worst.state] ? pillar : worst,
  );
}

function operationalCapacityLine(
  checkup: FinancialHealthCheckup,
  liquidity: FinancialHealthPillar,
  flow: FinancialHealthPillar,
): string {
  if (checkup.hasCriticalBase) {
    return 'Hoje a capacidade operacional do sistema está sob pressão na base — liquidez e/ou fluxo pedem lucidez antes do restante da leitura.';
  }

  const baseSeverity = Math.max(STATE_SEVERITY[liquidity.state], STATE_SEVERITY[flow.state]);

  if (baseSeverity >= STATE_SEVERITY.attention) {
    return 'Hoje a capacidade operacional do sistema está sob atenção — a base ainda sustenta a leitura, com lucidez nos pontos tensos.';
  }

  const inconclusiveCount = checkup.pillars.filter((p) => p.state === 'inconclusive').length;
  if (inconclusiveCount >= 3) {
    return 'Hoje a leitura de capacidade ainda é parcial — há lacunas declaradas; o que já é legível orienta o check-up sem inventar certeza.';
  }

  if (STATE_SEVERITY[liquidity.state] === 0 && STATE_SEVERITY[flow.state] === 0) {
    return 'Hoje seu sistema possui capacidade operacional folgada na base.';
  }

  return 'Hoje seu sistema possui boa capacidade operacional.';
}

function tensionLine(tension: FinancialHealthPillar, hasCriticalBase: boolean): string {
  if (hasCriticalBase && (tension.id === 'liquidity' || tension.id === 'flow')) {
    return `A principal tensão está na ${tension.name} (${CAPACITY_STATE_LABEL[tension.state]}).`;
  }

  if (tension.state === 'excellent' || tension.state === 'good') {
    return 'Nenhum pilar concentra tensão relevante neste recorte — a leitura permanece equilibrada.';
  }

  return `A principal tensão está na ${tension.name}.`;
}

function supportLine(
  pillars: readonly FinancialHealthPillar[],
  tensionId: FinancialHealthPillar['id'],
): string {
  const others = pillars.filter((p) => p.id !== tensionId);
  const strained = others.filter((p) => p.state === 'critical' || p.state === 'attention');

  if (strained.length === 0) {
    return 'Os demais pilares sustentam essa capacidade.';
  }

  return 'Os demais pilares contextualizam a leitura — sem competir com o foco da tensão principal.';
}

/** Progressive first-viewport copy — rearranges existing pillar states only. */
export function buildExecutiveSummary(checkup: FinancialHealthCheckup): ExecutiveSummaryLines {
  const liquidity = checkup.pillars.find((p) => p.id === 'liquidity');
  const flow = checkup.pillars.find((p) => p.id === 'flow');
  if (!liquidity || !flow) {
    return {
      capacityLine: 'A capacidade do sistema será legível quando os pilares estiverem disponíveis.',
      tensionLine: 'Aguarde a montagem da leitura.',
      supportLine: 'Sem inventar certeza enquanto os sinais chegam.',
    };
  }

  const tension = pickPrimaryTension(checkup.pillars);

  return {
    capacityLine: operationalCapacityLine(checkup, liquidity, flow),
    tensionLine: tensionLine(tension, checkup.hasCriticalBase),
    supportLine: supportLine(checkup.pillars, tension.id),
  };
}
