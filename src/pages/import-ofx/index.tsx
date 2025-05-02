import { useRef, useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { CloudArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ImportOfxPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setSuccess(false);
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
    if (!file) return;
    // Simula upload
    setTimeout(() => {
      setSuccess(true);
      setFile(null);
    }, 1200);
  }

  return (
    <ViewDefault>
      <div className="max-w-lg mx-auto mt-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-arrow mb-2">Importar arquivo OFX</h1>
          <p className="text-text/70 dark:text-text-dark/70 mb-4">
            Selecione um arquivo do seu banco para importar suas transações de forma rápida e segura.
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-brand-arrow/40 dark:border-brand-arrow/70 rounded-xl bg-background dark:bg-gray-900 py-12 px-4 cursor-pointer transition hover:border-brand-arrow/80 dark:hover:border-brand-arrow/90"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudArrowUpIcon className="w-12 h-12 text-brand-arrow dark:text-brand-arrow/80 mb-4" />
          <p className="text-base text-text/80 dark:text-gray-200 mb-2">Arraste e solte o arquivo .ofx aqui ou clique para selecionar</p>
          <input
            ref={inputRef}
            type="file"
            accept=".ofx"
            className="hidden"
            onChange={handleFileChange}
          />
          {file && (
            <div className="mt-4 text-sm text-brand-arrow font-medium dark:text-gray-100">{file.name}</div>
          )}
        </div>
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