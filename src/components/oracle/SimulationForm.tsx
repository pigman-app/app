import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Target, Sparkles, CheckCircle, Calendar, ArrowRight, X, RefreshCw } from 'lucide-react';
import { SimulationGoal } from '../../mocks/strategy';

interface SimulationFormProps {
  onSimulate?: (goal: SimulationGoal) => void;
  onCreateDream?: (goal: SimulationGoal, observations?: string) => void;
}

export default function SimulationForm({ onSimulate, onCreateDream }: SimulationFormProps) {
  const [goalTitle, setGoalTitle] = useState('Viagem para a Europa');
  const [targetAmount, setTargetAmount] = useState(25000);
  const [deadline, setDeadline] = useState(12);
  const [showResult, setShowResult] = useState(false);
  const [showCreateTrailModal, setShowCreateTrailModal] = useState(false);
  const [observations, setObservations] = useState('');

  const calculateSavings = () => {
    return targetAmount / deadline;
  };

  const handleSimulate = () => {
    const monthlySavings = calculateSavings();
    const simulation: SimulationGoal = {
      id: Date.now().toString(),
      title: goalTitle,
      targetAmount,
      deadline,
      monthlySavings,
      insights: [
        `Comandante, se reduzirmos 15% do Lazer, antecipamos sua meta em 2 meses.`,
        `Com o seu fluxo atual, você pode atingir este objetivo em ${deadline} meses.`,
      ],
      suggestedCuts: [
        {
          category: 'Lazer',
          current: 500.00,
          suggested: 425.00,
          percentage: 15,
        },
        {
          category: 'Alimentação',
          current: 1200.00,
          suggested: 1100.00,
          percentage: 8,
        },
        {
          category: 'Transporte',
          current: 450.00,
          suggested: 400.00,
          percentage: 11,
        },
      ],
    };

    setShowResult(true);
    onSimulate?.(simulation);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-brand-pink" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Simulador de Viabilidade
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            O que aconteceria se...
          </p>
        </div>
      </div>

      {!showResult ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta de Luxo
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              placeholder="Ex: Viagem para a Europa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Objetivo (R$)
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              placeholder="25000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prazo (meses)
            </label>
            <input
              type="number"
              value={deadline}
              onChange={(e) => setDeadline(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              placeholder="12"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulate}
            className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card shadow-soft-shadow hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Simular Estratégia
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            {/* Resposta Estruturada como na Landing */}
            <div className="space-y-3">
              {/* Viável! ✅ */}
              <div className="flex items-center gap-2 bg-brand-green/20 dark:bg-brand-green/30 px-4 py-3 rounded-card border border-brand-green/30">
                <CheckCircle className="w-5 h-5 text-brand-green" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-green mb-1">Viável! ✅</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Em {deadline} meses se economizar {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(calculateSavings())}/mês
                  </p>
                </div>
              </div>

              {/* Estratégia 🎯 */}
              <div className="flex items-center gap-2 bg-brand-yellow/20 dark:bg-brand-yellow/30 px-4 py-3 rounded-card border border-brand-yellow/30">
                <Target className="w-5 h-5 text-brand-yellow" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-yellow mb-1">Estratégia 🎯</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Reduzir gastos em {['Lazer', 'Alimentação', 'Transporte'].join(', ')} para atingir a meta
                  </p>
                </div>
              </div>

              {/* Trilha criada 📅 */}
              <div className="flex items-center gap-2 bg-brand-pink/20 dark:bg-brand-pink/30 px-4 py-3 rounded-card border border-brand-pink/30">
                <Calendar className="w-5 h-5 text-brand-pink" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-pink mb-1">Trilha criada 📅</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Meta automática adicionada ao seu Mapa de Sonhos ✈️
                  </p>
                </div>
              </div>
            </div>

            {/* Valor da Economia Mensal */}
            <div className="bg-gradient-to-r from-brand-green/10 to-brand-pink/10 dark:from-brand-green/20 dark:to-brand-pink/20 rounded-card p-4 border border-brand-green/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Economia mensal necessária</p>
              <p className="text-2xl font-bold text-brand-green">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                }).format(calculateSavings())}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                Sugestões de Ajustes:
              </h5>
              {[
                { category: 'Lazer', current: 500, suggested: 425, percentage: 15 },
                { category: 'Alimentação', current: 1200, suggested: 1100, percentage: 8 },
                { category: 'Transporte', current: 450, suggested: 400, percentage: 11 },
              ].map((cut, index) => (
                <motion.div
                  key={cut.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {cut.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Redução de {cut.percentage}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(cut.current)}
                    </p>
                    <p className="text-sm font-bold text-brand-green">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(cut.suggested)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Campo de Observações */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações para a IA (opcional)
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Não posso reduzir tanto com essa categoria de transporte"
                rows={3}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Informe ajustes ou restrições que a IA deve considerar ao criar sua trilha
              </p>
            </div>

            {/* Botão Criar Trilha */}
            {onCreateDream && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowCreateTrailModal(true);
                }}
                className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card shadow-soft-shadow hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Criar Trilha no Mapa de Sonhos
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowResult(false);
                setObservations(''); // Limpar observações ao resetar
              }}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Nova Simulação
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Modal Criar Trilha com Observações */}
      <AnimatePresence>
        {showCreateTrailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateTrailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md shadow-soft-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-pink" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Criar Trilha no Mapa de Sonhos
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateTrailModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Campo de Observações */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observações para a IA (opcional)
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Não posso reduzir tanto com essa categoria de transporte"
                  rows={4}
                  className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Informe ajustes ou restrições que a IA deve considerar ao criar sua trilha
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const simulation: SimulationGoal = {
                      id: Date.now().toString(),
                      title: goalTitle,
                      targetAmount,
                      deadline,
                      monthlySavings: calculateSavings(),
                      insights: [
                        `Comandante, se reduzirmos 15% do Lazer, antecipamos sua meta em 2 meses.`,
                        `Com o seu fluxo atual, você pode atingir este objetivo em ${deadline} meses.`,
                      ],
                      suggestedCuts: [
                        {
                          category: 'Lazer',
                          current: 500.00,
                          suggested: 425.00,
                          percentage: 15,
                        },
                        {
                          category: 'Alimentação',
                          current: 1200.00,
                          suggested: 1100.00,
                          percentage: 8,
                        },
                        {
                          category: 'Transporte',
                          current: 450.00,
                          suggested: 400.00,
                          percentage: 11,
                        },
                      ],
                    };
                    onCreateDream?.(simulation, observations || undefined);
                    setShowCreateTrailModal(false);
                    setObservations('');
                  }}
                  className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card shadow-soft-shadow hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Criar Trilha
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Gerar nova simulação considerando as observações
                    handleSimulate();
                    setShowCreateTrailModal(false);
                    // As observações serão mantidas para quando criar a trilha
                  }}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Gerar Nova Simulação
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



