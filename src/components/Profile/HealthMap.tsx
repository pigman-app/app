import { motion } from 'framer-motion';
import { Target, Heart } from 'lucide-react';

interface HealthMapProps {
  focus: string;
  currentElo: string;
}

export default function HealthMap({ focus, currentElo }: HealthMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-brand-green/10 to-brand-pink/10 dark:from-brand-green/20 dark:to-brand-pink/20 rounded-card-lg p-6 shadow-soft-shadow border border-brand-green/20 dark:border-brand-green/30"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-card bg-white dark:bg-gray-800 flex items-center justify-center shadow-soft">
          <Heart className="w-6 h-6 text-brand-pink" fill="currentColor" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-brand-green" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Mapa de Saúde Financeira
            </h3>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {focus}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-pink bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
              Elo {currentElo}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Foco atual
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



