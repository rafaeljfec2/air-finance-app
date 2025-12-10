import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { CloudArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { importOfx, ExtractHeader, ExtractTransaction } from '@/services/transactionService';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { Loading } from '@/components/Loading';
import { toast } from '@/components/ui/toast';

export function ImportOfxPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<ExtractTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [header, setHeader] = useState<ExtractHeader | null>(null);
  const [extractId, setExtractId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeCompany } = useActiveCompany();
  const pageSize = 10;

  const importMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      if (!activeCompany?.id) {
        throw new Error('Selecione uma empresa antes de importar.');
      }
      return importOfx(activeCompany.id, selectedFile);
    },
    onSuccess: (data) => {
      setPreview(
        data.transactions.map((tx) => ({
          ...tx,
          date: formatDate(tx.date),
        })),
      );
      setHeader(data.header);
      setExtractId(data.extractId);
      setSuccess(true);
      setError('');
      setCurrentPage(1);
      setFile(null);
      toast({
        title: 'Importação concluída',
        description: 'Arquivo OFX importado com sucesso.',
        type: 'success',
      });
    },
    onError: (err) => {
      console.error(err);
      setSuccess(false);
      setPreview([]);
      setHeader(null);
      setExtractId(null);
      setError('Não foi possível importar o arquivo OFX. Tente novamente.');
    },
  });

  const isImporting = importMutation.isPending;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setSuccess(false);
    setPreview([]);
    setCurrentPage(1);
    setHeader(null);
    setExtractId(null);
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.ofx')) {
      setError('Selecione um arquivo com extensão .ofx');
      setFile(null);
      return;
    }
    setFile(selected);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setPreview([]);
    setCurrentPage(1);
    setHeader(null);
    setExtractId(null);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.name.toLowerCase().endsWith('.ofx')) {
      setError('Selecione um arquivo com extensão .ofx');
      setFile(null);
      return;
    }
    setFile(dropped);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleImport() {
    if (!file) {
      setError('Selecione um arquivo OFX antes de importar.');
      return;
    }
    if (!activeCompany?.id) {
      setError('Selecione uma empresa ativa para importar o OFX.');
      return;
    }
    setError('');
    setSuccess(false);
    importMutation.mutate(file);
  }

  function formatDate(d: string) {
    if (!d) return '';
    if (d.includes('-')) {
      const [year, month, day] = d.split('-');
      if (year && month && day) return `${day}/${month}/${year}`;
    }
    return d && d.length === 8 ? `${d.slice(6, 8)}/${d.slice(4, 6)}/${d.slice(0, 4)}` : d;
  }

  const totalPages = Math.ceil(preview.length / pageSize) || 1;
  const paginatedPreview = preview.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ViewDefault>
      <div className="max-w-lg mx-auto mt-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-arrow mb-2">Importar arquivo OFX</h1>
          <p className="text-text/70 dark:text-text-dark/70 mb-4">
            Selecione um arquivo do seu banco para importar suas transações de forma rápida e
            segura.
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
            <div className="font-semibold mb-2 text-brand-arrow">Dados do arquivo</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
              <div>
                <span className="font-medium">Banco:</span> {header.bank || '-'}
              </div>
              <div>
                <span className="font-medium">Agência:</span> {header.agency || '-'}
              </div>
              <div>
                <span className="font-medium">Conta:</span> {header.account || '-'}
              </div>
              <div>
                <span className="font-medium">Tipo de Conta:</span> {header.accountType || '-'}
              </div>
              <div>
                <span className="font-medium">Período:</span>{' '}
                {formatDate(header.periodStart || '')} a {formatDate(header.periodEnd || '')}
              </div>
              <div>
                <span className="font-medium">Data de Geração:</span>{' '}
                {formatDate(header.generatedAt || '')}
              </div>
            </div>
            {extractId && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Protocolo de importação: {extractId}
              </div>
            )}
          </div>
        )}
        {preview.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mt-2">
            <div className="font-semibold mb-2 text-brand-arrow">
              Pré-visualização das transações ({preview.length})
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4 w-[15%]">Data</th>
                    <th className="py-2 pr-4 w-[65%]">Descrição</th>
                    <th className="py-2 text-right w-[20%]">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPreview.map((tx, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 pr-4 whitespace-nowrap">{tx.date}</td>
                      <td className="py-2 pr-4 whitespace-normal break-words">{tx.description}</td>
                      <td
                        className={
                          tx.amount < 0
                            ? 'text-red-500 py-2 text-right whitespace-nowrap'
                            : 'text-green-500 py-2 text-right whitespace-nowrap'
                        }
                      >
                        {tx.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Exibindo {paginatedPreview.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                {(currentPage - 1) * pageSize + paginatedPreview.length} de {preview.length}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark disabled:opacity-50"
                  >
                    Próxima
                  </button>
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
        <Button
          className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white py-3 text-lg dark:bg-brand-arrow dark:hover:bg-brand-arrow/80 dark:text-white"
          disabled={!file || isImporting}
          onClick={handleImport}
        >
          {isImporting ? <Loading size="small" /> : 'Importar arquivo'}
        </Button>
      </div>
    </ViewDefault>
  );
}

