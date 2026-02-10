import { motion } from 'framer-motion';
import { Repeat, ArrowRight } from 'lucide-react';

interface PendingExpensesCardProps {
  count: number;
  total: number;
  onNavigate?: () => void;
}

export default function PendingExpensesCard({ count, total, onNavigate }: PendingExpensesCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
            <Repeat className="w-6 h-6 text-brand-pink" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Recorrências
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {count} recorrências ativas
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(total)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Total mensal recorrente
        </p>
      </div>

      {/* Ícones de categorias (placeholder) */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">I</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">E</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">N</span>
        </div>
        <span className="text-xs text-gray-400 ml-auto">+ mais</span>
      </div>

      {/* Botão Verificar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate?.()}
        className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
      >
        Verificar
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}



