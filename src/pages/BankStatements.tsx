import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Upload, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import ImportHub from '../containers/ImportHub';

export default function BankStatements() {
  const [showImportHub, setShowImportHub] = useState(false);

  return (
    <div className="space-y-6 pb-20">
      {!showImportHub ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Extratos Bancários
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Adicione transações através de extratos
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-pink" />
            </div>
          </motion.div>

          {/* Card de Importação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-brand-pink" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Importar Extrato
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Envie seu extrato em PDF ou XLS para importar transações automaticamente
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowImportHub(true)}
              className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Importar Extrato
            </motion.button>
          </motion.div>

          {/* Instruções */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Como funciona
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-brand-pink">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Baixe seu extrato bancário
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Acesse o internet banking e baixe o extrato em PDF ou XLS
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-brand-pink">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Faça o upload do arquivo
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Arraste e solte ou clique para selecionar o arquivo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-brand-pink">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    IA processa automaticamente
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Nossa IA identifica e categoriza todas as transações
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-brand-pink">4</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Revise e confirme
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Verifique as transações identificadas e confirme a importação
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Histórico de Importações (Mock) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Últimas Importações
            </h3>
            <div className="space-y-3">
              {[
                { date: '15/01/2025', bank: 'Nubank', transactions: 23, status: 'success' },
                { date: '10/01/2025', bank: 'Inter', transactions: 18, status: 'success' },
                { date: '05/01/2025', bank: 'Itaú', transactions: 31, status: 'success' },
              ].map((importItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-card bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {importItem.bank}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {importItem.date}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {importItem.transactions} transações
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Importado
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <ImportHub onBack={() => setShowImportHub(false)} />
      )}
    </div>
  );
}

