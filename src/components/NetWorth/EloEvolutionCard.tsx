import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';

interface EloEvolutionCardProps {
  currentElo: string;
  nextElo: string;
  netWorth: number;
  progress: number; // 0-100
}

export default function EloEvolutionCard({ 
  currentElo, 
  nextElo, 
  netWorth,
  progress 
}: EloEvolutionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-br from-brand-pink to-pink-600 rounded-card-lg p-6 shadow-soft-shadow text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-lg font-bold">Evolução do Elo</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-sm opacity-90 mb-2">
            Seu patrimônio líquido está te levando de
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{currentElo}</span>
            <TrendingUp className="w-5 h-5" />
            <span className="text-xl font-bold">{nextElo}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs opacity-90">Progresso</span>
            <span className="text-sm font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        <p className="text-xs opacity-80">
          Patrimônio Líquido: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
          }).format(netWorth)}
        </p>
      </div>
    </motion.div>
  );
}



