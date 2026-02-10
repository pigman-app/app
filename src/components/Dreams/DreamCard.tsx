import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award, ArrowRight } from 'lucide-react';
import { Dream, getDreamProgress, getRemainingMonths } from '../../mocks/dreams';

interface DreamCardProps {
  dream: Dream;
  index: number;
  onViewTrail?: (dreamId: string) => void;
}

export default function DreamCard({ dream, index, onViewTrail }: DreamCardProps) {
  const progress = getDreamProgress(dream);
  const remainingMonths = getRemainingMonths(dream);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'bg-brand-green';
    if (progress >= 50) return 'bg-brand-yellow';
    return 'bg-brand-pink';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border border-gray-200 dark:border-gray-700"
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{dream.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {dream.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(dream.targetAmount)}
            </p>
          </div>
        </div>
        {dream.status === 'completed' && (
          <div className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-semibold">
            ✅ Concluído
          </div>
        )}
      </div>

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Progresso</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
            className={`h-full ${getProgressColor()} rounded-full`}
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(dream.currentAmount)}</span>
          <span>{formatCurrency(dream.targetAmount)}</span>
        </div>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-pink" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Faltam</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {remainingMonths} meses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-green" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Economizando</p>
            <p className="text-sm font-semibold text-brand-green">
              {formatCurrency(dream.monthlySavings)}/mês
            </p>
          </div>
        </div>
      </div>

      {/* Elo que será desbloqueado */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-brand-pink/10 to-brand-green/10 dark:from-brand-pink/20 dark:to-brand-green/20 rounded-card mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-yellow" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Desbloqueia Elo
          </span>
        </div>
        <span className="text-sm font-bold text-brand-pink">{dream.unlocksElo}</span>
      </div>

      {/* Botão Ver Trilha */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onViewTrail?.(dream.id)}
        className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
      >
        <Target className="w-4 h-4" />
        Ver Trilha Completa
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}







