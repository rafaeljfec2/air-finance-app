export interface ParsedOfxHeader {
  bank?: string;
  agency?: string;
  account?: string;
  accountType?: string;
  periodStart?: string;
  periodEnd?: string;
  generatedAt?: string;
}

export interface ParsedOfxTransaction {
  date: string;
  description: string;
  amount: number;
  fitId?: string;
}

function extractTag(content: string, tag: string): string | undefined {
  const match = content.match(new RegExp(`<${tag}>([^<\\n\\r]+)`, 'i'));
  return match?.[1]?.trim();
}

function normalizeDate(ofxDate?: string): string | undefined {
  if (!ofxDate) return undefined;
  // OFX date usually comes as YYYYMMDD or YYYYMMDDHHmmss
  const clean = ofxDate.replace(/[^0-9]/g, '');
  const year = clean.slice(0, 4);
  const month = clean.slice(4, 6);
  const day = clean.slice(6, 8);
  if (year.length === 4 && month.length === 2 && day.length === 2) {
    return `${year}-${month}-${day}`;
  }
  return ofxDate;
}

export function parseOfxContent(content: string): {
  header: ParsedOfxHeader;
  transactions: ParsedOfxTransaction[];
} {
  const header: ParsedOfxHeader = {
    bank: extractTag(content, 'BANKID'),
    agency: extractTag(content, 'BRANCHID') || extractTag(content, 'AGENCY') || undefined,
    account: extractTag(content, 'ACCTID') || extractTag(content, 'ACCOUNTID') || undefined,
    accountType: extractTag(content, 'ACCTTYPE'),
    periodStart: normalizeDate(extractTag(content, 'DTSTART')),
    periodEnd: normalizeDate(extractTag(content, 'DTEND')),
    generatedAt: normalizeDate(extractTag(content, 'DTSERVER') || extractTag(content, 'DTASOF')),
  };

  const transactions: ParsedOfxTransaction[] = [];
  const stmtRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match: RegExpExecArray | null;

  while ((match = stmtRegex.exec(content)) !== null) {
    const block = match[1];
    const date = normalizeDate(extractTag(block, 'DTPOSTED')) ?? '';
    const description = extractTag(block, 'MEMO') || extractTag(block, 'NAME') || '';
    const amountRaw = extractTag(block, 'TRNAMT');
    const fitId = extractTag(block, 'FITID');
    const amount = amountRaw ? parseFloat(amountRaw) : 0;

    if (!date && !description && !amount) {
      continue;
    }

    transactions.push({
      date,
      description,
      amount,
      fitId,
    });
  }

  return { header, transactions };
}

