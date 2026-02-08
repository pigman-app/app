import { motion } from 'framer-motion';
import { Flame, Award } from 'lucide-react';

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  const getMilestone = () => {
    if (streak >= 100) return { milestone: 100, next: null, reward: '🏆 Lenda' };
    if (streak >= 30) return { milestone: 30, next: 100, reward: '💎 Mestre' };
    if (streak >= 7) return { milestone: 7, next: 30, reward: '⭐ Estrela' };
    return { milestone: 0, next: 7, reward: '🔥 Iniciante' };
  };

  const { milestone, next, reward } = getMilestone();
  const isNearMilestone = next && streak >= next - 2;
  const isAtMilestone = milestone > 0 && streak === milestone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative overflow-hidden rounded-card-lg p-4 shadow-soft-shadow ${
        isAtMilestone
          ? 'bg-gradient-to-br from-brand-yellow/30 to-orange-500/30 border-4 border-brand-yellow'
          : 'bg-gradient-to-br from-brand-yellow/20 to-orange-500/20 border-2 border-brand-yellow'
      }`}
    >
      {/* Efeito de brilho quando está em marco */}
      {isAtMilestone && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      <div className="relative z-10 text-center">
        {/* Ícone de Fogo e Número do Streak lado a lado */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={isNearMilestone ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 1,
              repeat: isNearMilestone ? Infinity : 0,
              repeatDelay: 2,
            }}
          >
            <Flame className="w-8 h-8 text-brand-yellow" fill="currentColor" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-4xl font-bold text-brand-yellow"
          >
            {streak}
          </motion.div>
        </div>

        {/* Label */}
        <div className="text-base text-gray-700 dark:text-gray-300 mb-3 font-medium">
          dias consecutivos
        </div>

        {/* Badge de Marco */}
        {isAtMilestone && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-brand-yellow text-white px-4 py-2 rounded-full font-bold mb-2"
          >
            <Award className="w-5 h-5" />
            <span>{reward}</span>
          </motion.div>
        )}

        {/* Alerta de Próximo Marco */}
        {isNearMilestone && !isAtMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm font-semibold text-brand-pink mt-2"
          >
            ⚡ Faltam {next! - streak} dias para o próximo marco!
          </motion.div>
        )}

        {/* Progresso para próximo marco */}
        {next && !isAtMilestone && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Próximo marco: {next} dias</span>
              <span>{Math.round((streak / next) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(streak / next) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-brand-yellow to-orange-500"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}




