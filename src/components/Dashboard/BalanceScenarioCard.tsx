import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

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

type CardType = 'balance' | 'income' | 'expenses';

export default function BalanceScenarioCard({
  real,
  predicted,
}: BalanceScenarioCardProps) {
  const [scenario, setScenario] = useState<'real' | 'predicted'>('real');
  const [currentCard, setCurrentCard] = useState<CardType>('balance');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const periodModalRef = useRef<HTMLDivElement>(null);
  
  const currentData = scenario === 'real' ? real : predicted;

  // Fechar modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodModalRef.current && !periodModalRef.current.contains(event.target as Node)) {
        setShowPeriodModal(false);
      }
    };

    if (showPeriodModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPeriodModal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const cards: { type: CardType; label: string; icon: typeof Wallet; value: number; color: string; iconBgColor: string; bgColor: string; borderColor: string }[] = [
    {
      type: 'balance',
      label: 'Saldo Atual',
      icon: Wallet,
      value: currentData.balance,
      color: 'text-blue-600 dark:text-blue-400',
      iconBgColor: 'bg-blue-500/30',
      bgColor: 'from-blue-500/20 to-blue-400/10 dark:from-blue-600/30 dark:to-blue-500/20',
      borderColor: 'border-blue-500',
    },
    {
      type: 'income',
      label: 'Receitas',
      icon: TrendingUp,
      value: currentData.income,
      color: 'text-brand-green dark:text-green-400',
      iconBgColor: 'bg-brand-green/30',
      bgColor: 'from-brand-green/20 to-green-400/10 dark:from-brand-green/30 dark:to-green-500/20',
      borderColor: 'border-brand-green',
    },
    {
      type: 'expenses',
      label: 'Despesas',
      icon: TrendingDown,
      value: currentData.expenses,
      color: 'text-brand-pink dark:text-pink-400',
      iconBgColor: 'bg-brand-pink/30',
      bgColor: 'from-brand-pink/20 to-pink-400/10 dark:from-brand-pink/30 dark:to-pink-500/20',
      borderColor: 'border-brand-pink',
    },
  ];

  const currentCardIndex = cards.findIndex(card => card.type === currentCard);
  const currentCardData = cards[currentCardIndex];

  const nextCard = () => {
    const nextIndex = (currentCardIndex + 1) % cards.length;
    setCurrentCard(cards[nextIndex].type);
  };

  const prevCard = () => {
    const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    setCurrentCard(cards[prevIndex].type);
  };

  return (
    <motion.div
      key={`card-${currentCard}-${scenario}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${currentCardData.bgColor} border-2 ${currentCardData.borderColor} rounded-card-lg p-4 shadow-soft-shadow`}
    >
      {/* Toggle de Cenário */}
      <div className="mb-6">
        <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-card p-1 flex gap-1 w-full">
          <motion.button
            onClick={() => setScenario('real')}
            className={`flex-1 py-2 rounded-card text-sm font-semibold transition-colors ${
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
            className={`flex-1 py-2 rounded-card text-sm font-semibold transition-colors ${
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

      {/* Carrossel */}
      <div className="relative h-[220px] flex items-center">
        {/* Setas de Navegação - Fixas */}
        <button
          onClick={prevCard}
          className="absolute left-0 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-soft flex items-center justify-center border border-white/50 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          style={{ top: '110px', transform: 'translateY(-50%)' }}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={nextCard}
          className="absolute right-0 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-soft flex items-center justify-center border border-white/50 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          style={{ top: '110px', transform: 'translateY(-50%)' }}
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Card Atual */}
        <div className="w-full mx-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCardData.type}-${scenario}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full ${currentCardData.iconBgColor} flex items-center justify-center`}>
                  <currentCardData.icon className={`w-8 h-8 ${currentCardData.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">{currentCardData.label}</p>
              <motion.div
                key={currentCardData.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`text-4xl font-bold ${currentCardData.color}`}
              >
                {formatCurrency(currentCardData.value)}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores de Página */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 pb-2">
          {cards.map((card, index) => (
            <button
              key={card.type}
              onClick={() => setCurrentCard(card.type)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentCard === card.type
                  ? 'w-6 bg-white dark:bg-gray-200'
                  : 'bg-white/50 dark:bg-gray-400/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Botão de Período */}
      <div className="mt-4">
        <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-card p-1 w-full">
          <motion.button
            onClick={() => setShowPeriodModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between px-4 py-2 rounded-card text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Período</span>
            </div>
            <span className="text-sm font-medium capitalize">
              {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Modal de Seleção de Período */}
      <AnimatePresence>
        {showPeriodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPeriodModal(false)}
          >
            <motion.div
              ref={periodModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-sm shadow-soft-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Selecionar Período
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPeriodModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Seleção de Ano */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ano
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                    <motion.button
                      key={year}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-card text-sm font-semibold transition-colors ${
                        selectedYear === year
                          ? 'bg-brand-pink text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {year}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Seleção de Mês */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mês
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                  ].map((month, index) => (
                    <motion.button
                      key={month}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedMonth(index);
                        setShowPeriodModal(false);
                      }}
                      className={`px-3 py-2 rounded-card text-xs font-semibold transition-colors ${
                        selectedMonth === index
                          ? 'bg-brand-pink text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {month.substring(0, 3)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
