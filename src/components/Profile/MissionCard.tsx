import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { useState } from 'react';
import { Mission } from '../../mocks/gamification';

interface MissionCardProps {
  mission: Mission;
  index: number;
  onComplete?: (missionId: string) => void;
}

export default function MissionCard({ mission, index, onComplete }: MissionCardProps) {
  const [isCompleted, setIsCompleted] = useState(mission.completed);
  const [showConfetti, setShowConfetti] = useState(false);

  const progressPercentage = (mission.progress / mission.total) * 100;

  const handleToggle = () => {
    if (!isCompleted && mission.progress < mission.total) {
      // Simular progresso
      return;
    }
    
    if (!isCompleted) {
      setIsCompleted(true);
      setShowConfetti(true);
      onComplete?.(mission.id);
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft relative overflow-hidden"
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-brand-pink rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  scale: [1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          disabled={isCompleted || mission.progress < mission.total}
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-brand-green'
              : mission.progress >= mission.total
              ? 'bg-brand-pink/20 border-2 border-brand-pink'
              : 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
          }`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 text-white" />
          ) : mission.progress >= mission.total ? (
            <Circle className="w-4 h-4 text-brand-pink" />
          ) : null}
        </motion.button>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-semibold text-sm ${
                isCompleted ? 'text-brand-green line-through' : 'text-gray-900 dark:text-white'
              }`}>
                {mission.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {mission.description}
              </p>
            </div>
            
            {/* Recompensa */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-brand-pink font-bold">+{mission.reward.xp}</span>
                <span className="text-gray-400">XP</span>
              </div>
              {mission.reward.coins && (
                <div className="text-xs text-brand-yellow font-semibold">
                  +{mission.reward.coins} 🪙
                </div>
              )}
            </div>
          </div>

          {/* Barra de Progresso */}
          {!isCompleted && mission.total > 1 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Progresso
                </span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {mission.progress} / {mission.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-brand-pink h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Badge de Tipo */}
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              mission.type === 'daily'
                ? 'bg-brand-yellow/20 text-brand-yellow'
                : mission.type === 'weekly'
                ? 'bg-brand-pink/20 text-brand-pink'
                : 'bg-brand-green/20 text-brand-green'
            }`}>
              {mission.type === 'daily' ? 'Diária' : mission.type === 'weekly' ? 'Semanal' : 'Conquista'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



