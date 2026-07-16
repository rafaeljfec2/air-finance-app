import type { LucideIcon } from 'lucide-react';
import { ArrowDownCircle, ArrowUpCircle, CircleDot, CreditCard, Wallet } from 'lucide-react';

export function resolveObservationIcon(code: string, title: string): LucideIcon {
  const key = `${code} ${title}`.toLowerCase();

  if (key.includes('saíd') || key.includes('out') || code.toUpperCase().startsWith('S')) {
    return ArrowDownCircle;
  }
  if (key.includes('entrad') || key.includes('receb') || key.includes('income')) {
    return ArrowUpCircle;
  }
  if (key.includes('cart') || key.includes('credit') || code.toUpperCase().startsWith('C')) {
    return CreditCard;
  }
  if (key.includes('caixa') || key.includes('saldo') || key.includes('wallet')) {
    return Wallet;
  }

  return CircleDot;
}
