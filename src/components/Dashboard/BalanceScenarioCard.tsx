import { motion } from 'framer-motion';
import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceScenarioCardProps {
  real: {
    balance: number;
    income: number;
    expenses: number;
  };
  predicted: {
    balance: number;
    income: number;
    expenses: number;
  };
}

export default function BalanceScenarioCard({
  real,
  predicted,
}: BalanceScenarioCardProps) {
  const [scenario, setScenario] = useState<'real' | 'predicted'>('real');
  
  const currentData = scenario === 'real' ? real : predicted;

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
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      {/* Toggle de Cenário */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex gap-1">
          <motion.button
            onClick={() => setScenario('real')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              scenario === 'real'
                ? 'bg-white dark:bg-gray-600 text-brand-pink shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cenário Real
          </motion.button>
          <motion.button
            onClick={() => setScenario('predicted')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              scenario === 'predicted'
                ? 'bg-white dark:bg-gray-600 text-brand-pink shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cenário Previsto
          </motion.button>
        </div>
      </div>

      {/* Card Saldo (maior, em cima) */}
      <motion.div
        key={`balance-${scenario}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 dark:from-brand-green/20 dark:to-brand-green/10 border-2 border-brand-green rounded-card-lg p-6 mb-4 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-brand-green" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Saldo Atual</p>
        <motion.div
          key={currentData.balance}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-brand-green"
        >
          {formatCurrency(currentData.balance)}
        </motion.div>
      </motion.div>

      {/* Cards Receitas e Despesas (embaixo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Receitas */}
        <motion.div
          key={`income-${scenario}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10 border-2 border-blue-500 rounded-card-lg p-5 text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Receitas</p>
          <motion.div
            key={currentData.income}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-blue-500"
          >
            {formatCurrency(currentData.income)}
          </motion.div>
        </motion.div>

        {/* Card Despesas */}
        <motion.div
          key={`expenses-${scenario}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 dark:from-brand-pink/20 dark:to-brand-pink/10 border-2 border-brand-pink rounded-card-lg p-5 text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-brand-pink" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Despesas</p>
          <motion.div
            key={currentData.expenses}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-brand-pink"
          >
            {formatCurrency(currentData.expenses)}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
