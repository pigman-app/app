import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { EloType } from '../../mocks/gamification';

interface EloRoadmapProps {
  elos: Array<{
    name: EloType;
    focus: string;
    icon: string;
  }>;
  currentElo: EloType;
  progress: number; // 0-100
}

export default function EloRoadmap({ elos, currentElo, progress }: EloRoadmapProps) {
  const currentEloIndex = elos.findIndex(elo => elo.name === currentElo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Roadmap de Elos
      </h3>

      <div className="relative">
        {/* Trilha (linha vertical) */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
          {/* Parte percorrida (verde) - Elos completados */}
          {currentEloIndex > 0 && (
            <motion.div
              className="absolute top-0 bg-brand-green"
              style={{
                width: '2px',
                height: `${(currentEloIndex / (elos.length - 1)) * 100}%`,
              }}
              initial={{ height: 0 }}
              animate={{ 
                height: `${(currentEloIndex / (elos.length - 1)) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          )}
          
          {/* Progresso atual (animado) - Progresso no Elo atual */}
          {currentEloIndex < elos.length - 1 && (
            <motion.div
              className="absolute bg-brand-green"
              style={{
                top: `${(currentEloIndex / (elos.length - 1)) * 100}%`,
                width: '2px',
                height: `${(progress / 100) * (100 / (elos.length - 1))}%`,
              }}
              initial={{ height: 0 }}
              animate={{ 
                height: `${(progress / 100) * (100 / (elos.length - 1))}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          )}
        </div>

        {/* Elos */}
        <div className="space-y-6">
          {elos.map((elo, index) => {
            const isCompleted = index < currentEloIndex;
            const isCurrent = index === currentEloIndex;
            const isLocked = index > currentEloIndex;
            const isNext = index === currentEloIndex + 1;

            return (
              <motion.div
                key={elo.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                {/* Ícone do Elo */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-brand-green shadow-soft'
                    : isCurrent
                    ? 'bg-brand-pink shadow-soft-shadow ring-4 ring-brand-pink/20'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <span className="text-2xl">{elo.icon}</span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold ${
                      isCurrent
                        ? 'text-brand-pink text-lg'
                        : isCompleted
                        ? 'text-brand-green'
                        : isLocked
                        ? 'text-gray-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {elo.name}
                    </h4>
                    {isCurrent && (
                      <motion.span
                        className="text-xs bg-brand-pink/10 text-brand-pink px-2 py-0.5 rounded-full font-semibold"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Atual
                      </motion.span>
                    )}
                    {isNext && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Próximo
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isLocked ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {elo.focus}
                  </p>
                  {isCurrent && (
                    <motion.div
                      className="mt-2 text-xs text-brand-pink font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {progress.toFixed(0)}% completo
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

