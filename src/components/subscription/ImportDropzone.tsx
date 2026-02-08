import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, Check, X, Loader } from 'lucide-react';
import { userSettings } from '../../mocks/settings';

interface ImportDropzoneProps {
  fileType: 'pdf' | 'xls';
  onFileProcessed?: (transactions: any[]) => void;
}

interface ProcessedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export default function ImportDropzone({ fileType, onFileProcessed }: ImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState<ProcessedTransaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar permissões
  const canImport = fileType === 'pdf' 
    ? userSettings.permissions.canImportPDF 
    : userSettings.permissions.canImportXLS;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canImport) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!canImport) {
      setError('Esta funcionalidade requer upgrade para plano Pro ou Elite');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f => {
      if (fileType === 'pdf') {
        return f.type === 'application/pdf' || f.name.endsWith('.pdf');
      }
      return f.type.includes('spreadsheet') || f.name.endsWith('.xls') || f.name.endsWith('.xlsx');
    });

    if (file) {
      await processFile();
    } else {
      setError(`Por favor, selecione um arquivo ${fileType.toUpperCase()} válido`);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canImport) {
      await processFile();
    } else if (!canImport) {
      setError('Esta funcionalidade requer upgrade para plano Pro ou Elite');
    }
  };

  const processFile = async () => {
    setIsProcessing(true);
    setError(null);
    setProcessedTransactions(null);

    // Simular processamento por IA
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock de transações processadas
    const mockTransactions: ProcessedTransaction[] = [
      {
        id: '1',
        date: '15/12/2024',
        description: 'Supermercado Extra',
        amount: -250.50,
        category: 'Alimentação',
      },
      {
        id: '2',
        date: '14/12/2024',
        description: 'Posto Shell',
        amount: -180.00,
        category: 'Transporte',
      },
      {
        id: '3',
        date: '13/12/2024',
        description: 'Salário',
        amount: 3500.00,
        category: 'Renda',
      },
      {
        id: '4',
        date: '12/12/2024',
        description: 'Farmácia',
        amount: -85.30,
        category: 'Saúde',
      },
    ];

    setIsProcessing(false);
    setProcessedTransactions(mockTransactions);
    onFileProcessed?.(mockTransactions);
  };

  const handleConfirm = () => {
    // Confirmar importação
    console.log('Transações confirmadas:', processedTransactions);
    setProcessedTransactions(null);
  };

  const handleCancel = () => {
    setProcessedTransactions(null);
    setError(null);
  };

  if (!canImport) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Funcionalidade Bloqueada
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Importação de {fileType.toUpperCase()} está disponível apenas nos planos Pro e Elite
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-brand-pink text-white font-semibold px-6 py-2 rounded-card shadow-soft-shadow hover:bg-pink-600 transition-colors"
          >
            Fazer Upgrade
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-card-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-brand-pink bg-brand-pink/5'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
      >
        <input
          type="file"
          accept={fileType === 'pdf' ? '.pdf' : '.xls,.xlsx'}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {!isProcessing && !processedTransactions && (
          <div>
            {fileType === 'pdf' ? (
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            ) : (
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Arraste e solte seu arquivo {fileType.toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ou clique para selecionar
            </p>
            <Upload className="w-6 h-6 text-gray-400 mx-auto" />
          </div>
        )}

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader className="w-12 h-12 text-brand-pink" />
              </motion.div>
              <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                Processando com IA...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Analisando documento e extraindo transações
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-card p-4 flex items-center gap-3"
          >
            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processed Transactions Preview */}
      <AnimatePresence>
        {processedTransactions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border border-brand-green/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-brand-green" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Transações Identificadas
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              A IA identificou {processedTransactions.length} transações. Revise antes de confirmar:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {processedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                  <p className={`text-sm font-bold ${
                    transaction.amount >= 0 ? 'text-brand-green' : 'text-brand-pink'
                  }`}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="flex-1 bg-brand-green text-white font-semibold py-3 rounded-card shadow-soft-shadow hover:bg-green-600 transition-colors"
              >
                Confirmar Importação
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



