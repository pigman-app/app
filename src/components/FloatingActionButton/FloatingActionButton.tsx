import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, X, Sparkles, FileText, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import AddManualModal from './AddManualModal';
import AddEditModal from '../NetWorth/AddEditModal';

interface FloatingActionButtonProps {
  onNavigate?: (page: string) => void;
}

export default function FloatingActionButton({ onNavigate }: FloatingActionButtonProps) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showPatrimonyModal, setShowPatrimonyModal] = useState(false);
  const [patrimonyType, setPatrimonyType] = useState<'asset' | 'liability' | undefined>(undefined);

  const handleOptionClick = (option: 'ai' | 'extract' | 'manual' | 'asset' | 'liability') => {
    setShowOptionsModal(false);
    
    switch (option) {
      case 'ai':
        onNavigate?.('chat');
        break;
      case 'extract':
        onNavigate?.('bankStatements');
        break;
      case 'manual':
        setShowManualModal(true);
        break;
      case 'asset':
        setPatrimonyType('asset');
        setShowPatrimonyModal(true);
        break;
      case 'liability':
        setPatrimonyType('liability');
        setShowPatrimonyModal(true);
        break;
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-24 z-[60]" style={{ right: 'max(1rem, calc((100vw - min(100vw, 480px)) / 2 + 1rem))' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowOptionsModal(true)}
          className="w-14 h-14 rounded-full bg-brand-green shadow-soft-shadow flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Modal de Opções */}
      <AnimatePresence>
        {showOptionsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowOptionsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-sm shadow-soft-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Adicionar
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowOptionsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Opções */}
              <div className="space-y-4">
                {/* Seção: Adicionar Transações */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Adicionar transações
                  </h4>
                  <div className="space-y-2">
                    {/* Adicionar por IA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick('ai')}
                      className="w-full bg-white dark:bg-gray-800 rounded-card shadow-soft px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-brand-pink" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        Adicionar por meio de IA
                      </span>
                    </motion.button>

                    {/* Adicionar por Extrato */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick('extract')}
                      className="w-full bg-white dark:bg-gray-800 rounded-card shadow-soft px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-brand-green" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        Adicionar por meio de extrato
                      </span>
                    </motion.button>

                    {/* Adicionar Manualmente */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick('manual')}
                      className="w-full bg-white dark:bg-gray-800 rounded-card shadow-soft px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-yellow/10 dark:bg-brand-yellow/20 flex items-center justify-center flex-shrink-0">
                        <Edit className="w-5 h-5 text-brand-yellow" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        Adicionar manualmente
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Seção: Adicionar Ativo/Passivo ao Patrimônio */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Adicionar ativo/passivo ao patrimônio
                  </h4>
                  <div className="space-y-2">
                    {/* Adicionar Ativo */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick('asset')}
                      className="w-full bg-white dark:bg-gray-800 rounded-card shadow-soft px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-brand-green" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        Adicionar Ativo
                      </span>
                    </motion.button>

                    {/* Adicionar Passivo */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick('liability')}
                      className="w-full bg-white dark:bg-gray-800 rounded-card shadow-soft px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-5 h-5 text-brand-pink" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        Adicionar Passivo
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Abrir WhatsApp Web ou app
                      const phoneNumber = '5511999999999'; // Substitua pelo número real
                      const message = encodeURIComponent('Olá! Gostaria de interagir através do WhatsApp.');
                      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                      setShowOptionsModal(false);
                    }}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-4 rounded-card shadow-soft flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Interaja através do WhatsApp</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Adicionar Manualmente */}
      <AddManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />

      {/* Modal de Patrimônio */}
      {showPatrimonyModal && patrimonyType && (
        <AddEditModal
          isOpen={showPatrimonyModal}
          onClose={() => {
            setShowPatrimonyModal(false);
            setPatrimonyType(undefined);
          }}
          onSave={(item, type) => {
            // Salvar no localStorage
            try {
              const saved = localStorage.getItem('pigman_networth');
              const data = saved ? JSON.parse(saved) : { assets: [], liabilities: [] };
              
              if (type === 'asset') {
                data.assets = [...(data.assets || []), item];
              } else {
                data.liabilities = [...(data.liabilities || []), item];
              }
              
              // Recalcular net worth
              data.netWorth = (data.assets || []).reduce((sum: number, a: any) => sum + a.value, 0) -
                             (data.liabilities || []).reduce((sum: number, l: any) => sum + l.value, 0);
              
              localStorage.setItem('pigman_networth', JSON.stringify(data));
              
              // Navegar para patrimônio para ver o resultado
              onNavigate?.('patrimony');
            } catch (error) {
              console.error('Erro ao salvar:', error);
            }
            
            setShowPatrimonyModal(false);
            setPatrimonyType(undefined);
          }}
          type={patrimonyType}
        />
      )}
    </>
  );
}
