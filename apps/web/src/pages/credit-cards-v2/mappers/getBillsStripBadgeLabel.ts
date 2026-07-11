export function getBillsStripMoreBadgeLabel(
  totalBills: number,
  canScrollRight: boolean,
): string | null {
  if (!canScrollRight || totalBills <= 0) {
    return null;
  }
  return `Mais faturas · ${totalBills}`;
}

export function getBillsStripCountLabel(totalBills: number): string {
  return totalBills === 1 ? '1 fatura' : `${totalBills} faturas`;
}
