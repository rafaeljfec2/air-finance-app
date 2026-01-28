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
    .replace(/transfer[êe]ncia\s+(recebida|enviada)\s+(pelo\s+pix\s*-?\s*)?/gi, '')
    .replace(/pix\s+(recebido|enviado)\s*-?\s*/gi, '')
    .replace(/ted\s+(recebida|enviada)\s*-?\s*/gi, '')
    .replace(/pagamento\s+de\s+fatura\s*-?\s*/gi, '')
    .replace(/cr[ée]dito\s+em\s+conta\s*-?\s*/gi, '')
    .replace(/valor\s+adicionado[^-]*-?\s*/gi, '')
    .replace(/tarifa[^-]*-?\s*/gi, '')
    .replace(/boleto[^-]*-?\s*/gi, '')
    .trim();

  const cnpjMatch = cleaned.match(/(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/);
  const cpfMatch = cleaned.match(/(•••\.\d{3}\.\d{3}-••|\d{3}\.\d{3}\.\d{3}-\d{2})/);

  let recipient = cleaned
    .replace(/\s*-\s*\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}.*$/i, '')
    .replace(/\s*-\s*•••\.\d{3}\.\d{3}-••.*$/i, '')
    .replace(/\s*-\s*[A-Z\s]+ \(\d{4}\).*$/i, '')
    .replace(/\s+Ag[êe]ncia:.*$/i, '')
    .replace(/\s+Conta:.*$/i, '')
    .trim();

  if (cnpjMatch) {
    const beforeCnpj = cleaned.split(cnpjMatch[1])[0];
    const namePart = beforeCnpj.replace(/\s*-\s*$/, '').trim();
    if (namePart) {
      recipient = namePart;
    }
  } else if (cpfMatch) {
    const beforeCpf = cleaned.split(cpfMatch[1])[0];
    const namePart = beforeCpf.replace(/\s*-\s*$/, '').trim();
    if (namePart) {
      recipient = namePart;
    }
  }

  const words = recipient.split(/\s+/);
  if (words.length > 5) {
    recipient = words.slice(0, 5).join(' ') + '...';
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
