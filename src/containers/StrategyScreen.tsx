import { motion } from 'framer-motion';
import { Brain, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { predictionData, debtStrategy, SimulationGoal } from '../mocks/strategy';
import PredictiveAnalysis from '../components/oracle/PredictiveAnalysis';
import SimulationForm from '../components/oracle/SimulationForm';
import DebtStrategy from '../components/oracle/DebtStrategy';

interface StrategyScreenProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'chat') => void;
}

export default function StrategyScreen({ onNavigate }: StrategyScreenProps) {
  const [pigManMood, setPigManMood] = useState<'thinking' | 'excited' | 'neutral'>('thinking');

  const handleSimulation = () => {
    setPigManMood('excited');
    setTimeout(() => setPigManMood('thinking'), 3000);
  };

  const handleCreateDream = (goal: SimulationGoal) => {
    // Aqui você adicionaria o sonho ao mapa de sonhos
    // Por enquanto, apenas navega para a página de sonhos
    console.log('Criando sonho:', goal);
    onNavigate?.('dreams');
  };

  const getPigManEmoji = () => {
    switch (pigManMood) {
      case 'thinking':
        return '🤔';
      case 'excited':
        return '🎉';
      default:
        return '🧠';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Pig-Man Estrategista */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center shadow-soft-shadow relative"
            animate={pigManMood === 'thinking' ? {
              rotate: [0, -5, 5, -5, 0],
            } : pigManMood === 'excited' ? {
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: pigManMood === 'thinking' ? Infinity : 0,
              repeatDelay: 1,
            }}
          >
            <span className="text-3xl relative z-10">{getPigManEmoji()}</span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shadow-soft border-2 border-white dark:border-gray-800">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Financial Oracle
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inteligência e Estratégia Financeira
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Análise Preditiva */}
      <PredictiveAnalysis data={predictionData} />

      {/* Simulador de Viabilidade */}
      <SimulationForm 
        onSimulate={handleSimulation} 
        onCreateDream={handleCreateDream}
      />

      {/* Link para Chat Dedicado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-brand-pink/10 to-brand-green/10 dark:from-brand-pink/20 dark:to-brand-green/20 rounded-card-lg p-6 border-2 border-brand-pink/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center">
              <span className="text-2xl">🐷</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Chat com Financial Oracle
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Converse diretamente com o Pig-Man
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate?.('chat')}
            className="w-12 h-12 rounded-full bg-brand-pink flex items-center justify-center shadow-soft-shadow hover:bg-pink-600 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Estratégia de Dívidas */}
      <DebtStrategy data={debtStrategy} />
    </div>
  );
}



