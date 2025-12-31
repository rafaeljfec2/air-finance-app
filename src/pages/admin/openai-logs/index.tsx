import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ViewDefault } from '@/layouts/ViewDefault';
import { OpenAILog, openaiService } from '@/services/openaiService';
import { Bot, ChevronLeft, Eye, Search, Terminal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function OpenAILogsPage() {
  const [logs, setLogs] = useState<OpenAILog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
  const [selectedLog, setSelectedLog] = useState<OpenAILog | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await openaiService.getLogs();
        console.log('OpenAI Logs Response:', JSON.stringify(data, null, 2));
        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      log.aiModel.toLowerCase().includes(searchLower) ||
      log.promptOrDescription.toLowerCase().includes(searchLower) ||
      (log.response && log.response.toLowerCase().includes(searchLower));
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Link to="/settings" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <Bot className="h-8 w-8 text-primary-400" />
                 <h1 className="text-2xl font-bold text-text dark:text-text-dark">Logs da OpenAI</h1>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 Histórico de interações com a API da OpenAI
               </p>
            </div>
          </div>

          {/* Busca e Filtros */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar nos logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm h-10"
                  />
                </div>
                <div className="flex gap-2">
                   <Button 
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('all')}
                      size="sm"
                      className={statusFilter === 'all' ? 'bg-primary-500 hover:bg-primary-600 text-white' : ''}
                   >
                     Todos
                   </Button>
                   <Button 
                      variant={statusFilter === 'success' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('success')}
                      size="sm"
                      className={statusFilter === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                   >
                     Sucesso
                   </Button>
                   <Button 
                      variant={statusFilter === 'error' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('error')}
                      size="sm"
                      className={statusFilter === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                   >
                     Erro
                   </Button>
                </div>
              </div>
            </div>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="text-primary-500" />
            </div>
          ) : (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark">
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Data</th>
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Modelo</th>
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Input</th>
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Output</th>
                      <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Meta</th>
                      <th className="text-right p-4 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log._id} className="border-b border-border dark:border-border-dark hover:bg-muted/30 transition-colors">
                        <td className="p-4 align-top">
                          <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                            {log.status || 'Unknown'}
                          </Badge>
                        </td>
                        <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {(() => {
                            let date: Date | null = null;
                            
                            // 1. Try to parse createdAt if it's a valid string/date
                            if (log.createdAt && typeof log.createdAt !== 'object') {
                              const parsed = new Date(log.createdAt);
                              if (!isNaN(parsed.getTime())) {
                                date = parsed;
                              }
                            }

                            // 2. If no valid date yet, try extracting from _id or id
                            if (!date) {
                                const idToUse = log._id || (log as any).id;
                                if (idToUse && typeof idToUse === 'string') {
                                   try {
                                      const timestamp = parseInt(idToUse.substring(0, 8), 16) * 1000;
                                      if (!isNaN(timestamp)) {
                                         date = new Date(timestamp);
                                      }
                                   } catch (e) {
                                     // ignore
                                   }
                                }
                            }
                            
                            
                            return date ? new Intl.DateTimeFormat('pt-BR', {
                                timeZone: 'America/Sao_Paulo',
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }).format(date) : '-';
                          })()}
                        </td>
                        <td className="p-4 align-top text-sm font-mono text-gray-600 dark:text-gray-300">{log.aiModel || '-'}</td>
                        <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300 min-w-[200px] max-w-xs truncate" title={log.promptOrDescription}>
                          {log.promptOrDescription || '-'}
                        </td>
                        <td className="p-4 align-top text-sm font-mono text-gray-600 dark:text-gray-300 min-w-[200px] max-w-xs truncate" title={log.response || log.errorMessage}>
                          {log.response || log.errorMessage || '-'}
                        </td>
                        <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300">
                          {log.metadata && (
                             <div className="flex items-center gap-1" title={JSON.stringify(log.metadata, null, 2)}>
                               <Terminal className="h-4 w-4" />
                               {log.metadata.latencyMs ? (
                                   <span>{log.metadata.latencyMs}ms</span>
                               ) : (
                                   <span>Info</span>
                               )}
                             </div>
                          )}
                        </td>
                        <td className="p-4 align-top text-right">
                           <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                             <Eye className="h-4 w-4" />
                           </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <Bot className="h-10 w-10 opacity-20" />
                        <p>Nenhum log encontrado.</p>
                    </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background dark:bg-card-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
               <h2 className="text-xl font-bold text-text dark:text-text-dark flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary-500" />
                  Detalhes do Log
               </h2>
               <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                 <X className="h-5 w-5" />
               </Button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Status</label>
                        <Badge variant={selectedLog.status === 'success' ? 'success' : 'destructive'}>
                            {selectedLog.status}
                        </Badge>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Data</label>
                        <span className="text-sm font-mono">
                            {(() => {
                                let date: Date | null = null;
                                
                                // 1. Try to parse createdAt if it's a valid string/date
                                if (selectedLog.createdAt && typeof selectedLog.createdAt !== 'object') {
                                    const parsed = new Date(selectedLog.createdAt);
                                    if (!isNaN(parsed.getTime())) {
                                        date = parsed;
                                    }
                                }

                                // 2. If no valid date yet, try extracting from _id or id
                                if (!date) {
                                    const idToUse = selectedLog._id || (selectedLog as any).id;
                                    if (idToUse && typeof idToUse === 'string') {
                                        try {
                                            const timestamp = parseInt(idToUse.substring(0, 8), 16) * 1000;
                                            if (!isNaN(timestamp)) {
                                                date = new Date(timestamp);
                                            }
                                        } catch (e) {
                                            // ignore
                                        }
                                    }
                                }
                                
                                
                                return date ? new Intl.DateTimeFormat('pt-BR', {
                                    timeZone: 'America/Sao_Paulo',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).format(date) : '-';
                            })()}
                        </span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Modelo</label>
                        <span className="text-sm font-mono">{selectedLog.aiModel}</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Latência</label>
                        <span className="text-sm font-mono">{selectedLog.metadata?.latencyMs}ms</span>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">Input / Prompt</label>
                    <div className="bg-muted dark:bg-black/30 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap">{selectedLog.promptOrDescription}</pre>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">
                        {selectedLog.status === 'success' ? 'Output / Response' : 'Error Message'}
                    </label>
                     <div className={`p-4 rounded-lg overflow-x-auto ${selectedLog.status === 'success' ? 'bg-muted dark:bg-black/30' : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900'}`}>
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                            {selectedLog.response || selectedLog.errorMessage}
                        </pre>
                    </div>
                </div>

                {selectedLog.metadata && (
                    <div>
                        <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">Metadata Completo</label>
                        <div className="bg-muted dark:bg-black/30 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-xs font-mono text-blue-600 dark:text-blue-400">
                                {JSON.stringify(selectedLog.metadata, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </ViewDefault>
  );
}
