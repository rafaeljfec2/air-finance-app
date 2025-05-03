import { useRef, useState } from "react";
import { ViewDefault } from "@/layouts/ViewDefault";
import { Button } from "@/components/ui/button";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Função mock para parsear OFX (agora também extrai cabeçalho)
function parseOfx(file: File, callback: (txs: any[], header: any) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    // Cabeçalho
    const bankId = text.match(/<BANKID>([^<\n]+)/)?.[1] || "";
    const branchId = text.match(/<BRANCHID>([^<\n]+)/)?.[1] || "";
    const acctId = text.match(/<ACCTID>([^<\n]+)/)?.[1] || "";
    const acctType = text.match(/<ACCTTYPE>([^<\n]+)/)?.[1] || "";
    const dtStart = text.match(/<DTSTART>([^<\n]+)/)?.[1]?.slice(0, 8) || "";
    const dtEnd = text.match(/<DTEND>([^<\n]+)/)?.[1]?.slice(0, 8) || "";
    const dtGen = text.match(/<DTSERVER>([^<\n]+)/)?.[1]?.slice(0, 8) || "";
    const bankName = text.match(/<ORG>([^<\n]+)/)?.[1] || "";
    // Transações
    const regex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    const matches = text.matchAll(regex);
    const txs = [];
    for (const match of matches) {
      const block = match[1];
      const date = block.match(/<DTPOSTED>([^<\n]+)/)?.[1]?.slice(0, 8) || "";
      const desc = block.match(/<MEMO>([^<\n]+)/)?.[1] || "";
      const value = block.match(/<TRNAMT>([^<\n]+)/)?.[1] || "";
      txs.push({
        date: date
          ? `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`
          : "",
        description: desc,
        amount: Number(value),
      });
    }
    callback(txs, {
      bankId,
      branchId,
      acctId,
      acctType,
      dtStart,
      dtEnd,
      dtGen,
      bankName,
    });
  };
  reader.readAsText(file);
}

export default function ImportOfxPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [header, setHeader] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess(false);
    setPreview([]);
    setHeader(null);
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".ofx")) {
      setError("Selecione um arquivo com extensão .ofx");
      setFile(null);
      return;
    }
    setFile(selected);
    parseOfx(selected, (txs, h) => {
      setPreview(txs);
      setHeader(h);
    });
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setPreview([]);
    setHeader(null);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.name.toLowerCase().endsWith(".ofx")) {
      setError("Selecione um arquivo com extensão .ofx");
      setFile(null);
      return;
    }
    setFile(dropped);
    parseOfx(dropped, (txs, h) => {
      setPreview(txs);
      setHeader(h);
    });
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleImport() {
    if (!file) return;
    // Simula upload
    setTimeout(() => {
      setSuccess(true);
      setFile(null);
      setPreview([]);
      setHeader(null);
    }, 1200);
  }

  function formatDate(d: string) {
    return d && d.length === 8
      ? `${d.slice(6, 8)}/${d.slice(4, 6)}/${d.slice(0, 4)}`
      : "";
  }

  return (
    <ViewDefault>
      <div className="max-w-lg mx-auto mt-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-arrow mb-2">
            Importar arquivo OFX
          </h1>
          <p className="text-text/70 dark:text-text-dark/70 mb-4">
            Selecione um arquivo do seu banco para importar suas transações de
            forma rápida e segura.
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-brand-arrow/40 dark:border-brand-arrow/70 rounded-xl bg-background dark:bg-gray-900 py-4 px-4 cursor-pointer transition hover:border-brand-arrow/80 dark:hover:border-brand-arrow/90"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-brand-arrow dark:text-brand-arrow/80 mb-4" />
          <p className="text-base text-text/80 dark:text-gray-200 mb-2">
            Arraste e solte o arquivo .ofx aqui ou clique para selecionar
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".ofx"
            className="hidden"
            onChange={handleFileChange}
          />
          {file && (
            <div className="mt-4 text-sm text-brand-arrow font-medium dark:text-gray-100">
              {file.name}
            </div>
          )}
        </div>
        {header && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mt-2 mb-2">
            <div className="font-semibold mb-2 text-brand-arrow">
              Dados do arquivo
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
              <div>
                <span className="font-medium">Banco:</span>{" "}
                {header.bankName || header.bankId}
              </div>
              <div>
                <span className="font-medium">Agência:</span> {header.branchId}
              </div>
              <div>
                <span className="font-medium">Conta:</span> {header.acctId}
              </div>
              <div>
                <span className="font-medium">Tipo de Conta:</span>{" "}
                {header.acctType}
              </div>
              <div>
                <span className="font-medium">Período:</span>{" "}
                {formatDate(header.dtStart)} a {formatDate(header.dtEnd)}
              </div>
              <div>
                <span className="font-medium">Data de Geração:</span>{" "}
                {formatDate(header.dtGen)}
              </div>
            </div>
          </div>
        )}
        {preview.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mt-2">
            <div className="font-semibold mb-2 text-brand-arrow">
              Pré-visualização das transações ({preview.length})
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Data</th>
                    <th className="py-2 pr-4">Descrição</th>
                    <th className="py-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 8).map((tx, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-2 pr-4 whitespace-nowrap">{tx.date}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {tx.description}
                      </td>
                      <td
                        className={
                          tx.amount < 0
                            ? "text-red-500 py-2"
                            : "text-green-500 py-2"
                        }
                      >
                        {tx.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 8 && (
                <div className="text-xs text-gray-500 mt-2">
                  Exibindo as 8 primeiras transações...
                </div>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
            <XCircleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Arquivo importado com sucesso!</span>
          </div>
        )}
        <Button
          className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-3 text-lg dark:bg-brand-arrow dark:hover:bg-brand-arrow/80 dark:text-white"
          disabled={!file}
          onClick={handleImport}
        >
          Importar arquivo
        </Button>
      </div>
    </ViewDefault>
  );
}
