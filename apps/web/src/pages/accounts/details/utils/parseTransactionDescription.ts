export type TransactionType =
  | 'pix_received'
  | 'pix_sent'
  | 'ted_received'
  | 'ted_sent'
  | 'boleto_paid'
  | 'bill_payment'
  | 'credit'
  | 'debit'
  | 'fee'
  | 'transfer_received'
  | 'transfer_sent'
  | 'unknown';

export interface ParsedTransaction {
  readonly type: TransactionType;
  readonly label: string;
  readonly recipient: string;
  readonly isCredit: boolean;
}

const TYPE_PATTERNS: ReadonlyArray<{
  readonly pattern: RegExp;
  readonly type: TransactionType;
  readonly label: string;
}> = [
  {
    pattern: /transfer[êe]ncia\s+recebida\s+pelo\s+pix/i,
    type: 'pix_received',
    label: 'Pix recebido',
  },
  {
    pattern: /transfer[êe]ncia\s+enviada\s+pelo\s+pix/i,
    type: 'pix_sent',
    label: 'Pix enviado',
  },
  {
    pattern: /pix\s+recebido/i,
    type: 'pix_received',
    label: 'Pix recebido',
  },
  {
    pattern: /pix\s+enviado/i,
    type: 'pix_sent',
    label: 'Pix enviado',
  },
  {
    pattern: /transfer[êe]ncia\s+recebida/i,
    type: 'transfer_received',
    label: 'Transferência recebida',
  },
  {
    pattern: /transfer[êe]ncia\s+enviada/i,
    type: 'transfer_sent',
    label: 'Transferência enviada',
  },
  {
    pattern: /ted\s+recebida/i,
    type: 'ted_received',
    label: 'TED recebida',
  },
  {
    pattern: /ted\s+enviada/i,
    type: 'ted_sent',
    label: 'TED enviada',
  },
  {
    pattern: /pagamento\s+de\s+fatura/i,
    type: 'bill_payment',
    label: 'Pagamento de fatura',
  },
  {
    pattern: /boleto/i,
    type: 'boleto_paid',
    label: 'Boleto pago',
  },
  {
    pattern: /tarifa/i,
    type: 'fee',
    label: 'Tarifa',
  },
  {
    pattern: /cr[ée]dito\s+em\s+conta/i,
    type: 'credit',
    label: 'Crédito em conta',
  },
  {
    pattern: /valor\s+adicionado/i,
    type: 'credit',
    label: 'Crédito em conta',
  },
  {
    pattern: /d[ée]bito/i,
    type: 'debit',
    label: 'Débito',
  },
];

function extractRecipient(description: string): string {
  const cleaned = description
    .replaceAll(/transfer[êe]ncia\s+(recebida|enviada)\s+(pelo\s+pix\s*-?\s*)?/gi, '')
    .replaceAll(/pix\s+(recebido|enviado)\s*-?\s*/gi, '')
    .replaceAll(/ted\s+(recebida|enviada)\s*-?\s*/gi, '')
    .replaceAll(/pagamento\s+de\s+fatura\s*-?\s*/gi, '')
    .replaceAll(/cr[ée]dito\s+em\s+conta\s*-?\s*/gi, '')
    .replaceAll(/valor\s+adicionado[^-]*-?\s*/gi, '')
    .replaceAll(/tarifa[^-]*-?\s*/gi, '')
    .replaceAll(/boleto[^-]*-?\s*/gi, '')
    .trim();

  const cnpjMatch = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/.exec(cleaned);
  const cpfMatch = /(•••\.\d{3}\.\d{3}-••|\d{3}\.\d{3}\.\d{3}-\d{2})/.exec(cleaned);

  let recipient = cleaned
    .replaceAll(/\s*-\s*\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}.*$/i, '')
    .replaceAll(/\s*-\s*•••\.\d{3}\.\d{3}-••.*$/i, '')
    .replaceAll(/\s*-\s*[A-Z\s]+ \(\d{4}\).*$/i, '')
    .replaceAll(/\s+Ag[êe]ncia:.*$/i, '')
    .replaceAll(/\s+Conta:.*$/i, '')
    .trim();

  if (cnpjMatch?.[1]) {
    const beforeCnpj = cleaned.split(cnpjMatch[1])[0];
    const namePart = beforeCnpj.replaceAll(/\s*-\s*$/, '').trim();
    if (namePart) {
      recipient = namePart;
    }
  } else if (cpfMatch?.[1]) {
    const beforeCpf = cleaned.split(cpfMatch[1])[0];
    const namePart = beforeCpf.replaceAll(/\s*-\s*$/, '').trim();
    if (namePart) {
      recipient = namePart;
    }
  }

  return recipient || 'Transação';
}

function detectType(description: string, amount: number): { type: TransactionType; label: string } {
  const lowerDesc = description.toLowerCase();

  for (const { pattern, type, label } of TYPE_PATTERNS) {
    if (pattern.test(lowerDesc)) {
      return { type, label };
    }
  }

  if (amount > 0) {
    return { type: 'credit', label: 'Crédito' };
  }

  return { type: 'debit', label: 'Débito' };
}

export function parseTransactionDescription(
  description: string,
  amount: number,
): ParsedTransaction {
  const { type, label } = detectType(description, amount);
  const recipient = extractRecipient(description);
  const isCredit = amount > 0;

  return {
    type,
    label,
    recipient,
    isCredit,
  };
}
