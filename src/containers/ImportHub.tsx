import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, FileSpreadsheet, ArrowLeft, Brain } from 'lucide-react';
import ImportDropzone from '../components/subscription/ImportDropzone';

interface ImportHubProps {
  onBack?: () => void;
}

export default function ImportHub({ onBack }: ImportHubProps) {
  const [selectedType, setSelectedType] = useState<'pdf' | 'xls' | null>(null);

  const handleFileProcessed = (transactions: any[]) => {
    console.log('Transações processadas:', transactions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hub de Importação
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Importe suas transações com IA
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {!selectedType ? (
        /* Tipo de Arquivo Selection */
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('pdf')}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border-2 border-gray-200 dark:border-gray-700 hover:border-brand-pink transition-colors"
          >
            <FileText className="w-12 h-12 text-brand-pink mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Importar PDF
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Faturas e extratos bancários
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType('xls')}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border-2 border-gray-200 dark:border-gray-700 hover:border-brand-pink transition-colors"
          >
            <FileSpreadsheet className="w-12 h-12 text-brand-pink mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Importar XLS
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Planilhas Excel
            </p>
          </motion.button>
        </div>
      ) : (
        /* Dropzone */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedType(null)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Importar {selectedType.toUpperCase()}
            </h2>
          </div>
          <ImportDropzone fileType={selectedType} onFileProcessed={handleFileProcessed} />
        </motion.div>
      )}
    </div>
  );
}



