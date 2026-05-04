function stripMarkdownBold(value: string): string {
  return value.replaceAll('**', '').replace(/\s+/g, ' ').trim();
}

export function humanizeImpactForDisplay(impact: string): string {
  const trimmed = impact.trim();
  if (trimmed === '') {
    return '';
  }

  const economiaTypical = trimmed.match(
    /Economia\s+t[ií]pica\s*\*\*([^*]+)\*\*\s*(?:em\s+juros\s+se\s+taxa\s+cair\s*\*\*[^*]+\*\*)?/i,
  );
  if (economiaTypical !== null) {
    const rawAmount = economiaTypical[1].trim();
    const amount = rawAmount.replace(/\s*\/\s*m[eê]s\s*$/i, '').trim();
    return `Você pode economizar cerca de ${amount}/mês.`;
  }

  const economiaShort = trimmed.match(/^Economia\s+t[ií]pica\s*\*\*([^*]+)\*\*\.?\s*$/i);
  if (economiaShort !== null) {
    const rawAmount = economiaShort[1].trim();
    const amount = rawAmount.replace(/\s*\/\s*m[eê]s\s*$/i, '').trim();
    return `Você pode economizar cerca de ${amount}/mês.`;
  }

  const liberaPct = trimmed.match(/Libera\s+at[eé]\s*\*\*(\d+)\s*%\*\*/i);
  if (liberaPct !== null) {
    return `Você pode liberar cerca de ${liberaPct[1]}% da renda para o caixa.`;
  }

  const liberaAmount = trimmed.match(/Libera\s+at[eé]\s*\*\*([^*]+)\*\*/i);
  if (liberaAmount !== null) {
    return `Você pode liberar cerca de ${liberaAmount[1].trim().replace(/\.$/, '')} por mês.`;
  }

  return stripMarkdownBold(trimmed);
}
