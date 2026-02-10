import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Home, GraduationCap, CreditCard, ArrowRight, ArrowLeft, Sparkles, PiggyBank, Target, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

type TipCategory = 'all' | 'income' | 'savings' | 'investments' | 'debts';

interface Tip {
  id: string;
  category: TipCategory;
  title: string;
  description: string;
  icon: typeof Lightbulb;
  color: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

export default function PigmanTips() {
  const [selectedCategory, setSelectedCategory] = useState<TipCategory>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Mock de dicas - em produção viria de uma API/IA
  const allTips: Tip[] = [
    // Renda Extra
    {
      id: '1',
      category: 'income',
      title: 'Freelance nas horas vagas',
      description: 'Aproveite suas habilidades para oferecer serviços online. Plataformas como 99freelas e Workana conectam profissionais a projetos. Comece com pequenos trabalhos e aumente gradualmente.',
      icon: TrendingUp,
      color: 'green',
      priority: 'high',
      tags: ['Renda Extra', 'Freelance'],
    },
    {
      id: '2',
      category: 'income',
      title: 'Venda de produtos usados',
      description: 'Faça uma limpeza em casa e venda itens que não usa mais. Apps como OLX e Enjoei facilitam a venda. É uma forma rápida de gerar renda extra sem investimento inicial.',
      icon: PiggyBank,
      color: 'green',
      priority: 'medium',
      tags: ['Renda Extra', 'Vendas'],
    },
    {
      id: '3',
      category: 'income',
      title: 'Tutoria online',
      description: 'Se você tem conhecimento em alguma área, ofereça aulas particulares online. Pode ser sobre idiomas, matemática, música ou qualquer habilidade que domine.',
      icon: GraduationCap,
      color: 'green',
      priority: 'medium',
      tags: ['Renda Extra', 'Educação'],
    },
    // Economia Doméstica
    {
      id: '4',
      category: 'savings',
      title: 'Revisão de assinaturas',
      description: 'Analise todas as suas assinaturas mensais (streaming, apps, revistas). Cancele as que não usa regularmente. Isso pode economizar centenas de reais por ano.',
      icon: Home,
      color: 'pink',
      priority: 'high',
      tags: ['Economia', 'Gastos Fixos'],
    },
    {
      id: '5',
      category: 'savings',
      title: 'Planejamento de compras',
      description: 'Faça uma lista antes de ir ao supermercado e siga-a rigorosamente. Evite compras por impulso. Compare preços e aproveite promoções de produtos que realmente precisa.',
      icon: Target,
      color: 'pink',
      priority: 'high',
      tags: ['Economia', 'Compras'],
    },
    {
      id: '6',
      category: 'savings',
      title: 'Redução de energia',
      description: 'Troque lâmpadas por LED, desligue aparelhos da tomada quando não usar e aproveite a luz natural. Pequenas mudanças podem reduzir significativamente a conta de luz.',
      icon: Home,
      color: 'pink',
      priority: 'medium',
      tags: ['Economia', 'Energia'],
    },
    // Investimentos
    {
      id: '7',
      category: 'investments',
      title: 'Reserva de emergência primeiro',
      description: 'Antes de investir, construa uma reserva de emergência equivalente a 6 meses de gastos. Mantenha em uma conta de fácil acesso, como poupança ou CDB com liquidez diária.',
      icon: Shield,
      color: 'blue',
      priority: 'high',
      tags: ['Investimentos', 'Reserva'],
    },
    {
      id: '8',
      category: 'investments',
      title: 'Comece com Tesouro Direto',
      description: 'O Tesouro Selic é ideal para iniciantes. É seguro, tem liquidez diária e rende mais que a poupança. Comece com valores pequenos para se familiarizar.',
      icon: TrendingUp,
      color: 'blue',
      priority: 'medium',
      tags: ['Investimentos', 'Tesouro'],
    },
    {
      id: '9',
      category: 'investments',
      title: 'Diversificação é chave',
      description: 'Não coloque todos os ovos na mesma cesta. Distribua seus investimentos entre diferentes tipos (renda fixa, ações, fundos) para reduzir riscos.',
      icon: Sparkles,
      color: 'blue',
      priority: 'medium',
      tags: ['Investimentos', 'Estratégia'],
    },
    // Gestão de Dívidas
    {
      id: '10',
      category: 'debts',
      title: 'Método da bola de neve',
      description: 'Priorize pagar a dívida com menor valor primeiro, mantendo o mínimo nas outras. Quando quitar, use o valor que pagava nela para a próxima. Isso cria momentum psicológico.',
      icon: CreditCard,
      color: 'yellow',
      priority: 'high',
      tags: ['Dívidas', 'Estratégia'],
    },
    {
      id: '11',
      category: 'debts',
      title: 'Negocie com credores',
      description: 'Entre em contato com seus credores antes de atrasar. Muitos oferecem descontos, parcelamento ou refinanciamento. É melhor negociar do que deixar a dívida crescer.',
      icon: CreditCard,
      color: 'yellow',
      priority: 'high',
      tags: ['Dívidas', 'Negociação'],
    },
    {
      id: '12',
      category: 'debts',
      title: 'Evite novos empréstimos',
      description: 'Não use empréstimos para pagar outras dívidas, a menos que a taxa seja significativamente menor. Foque em reduzir gastos e aumentar a renda para quitar o que já tem.',
      icon: CreditCard,
      color: 'yellow',
      priority: 'high',
      tags: ['Dívidas', 'Prevenção'],
    },
  ];

  const getCategoryIcon = (category: TipCategory) => {
    switch (category) {
      case 'income':
        return TrendingUp;
      case 'savings':
        return Home;
      case 'investments':
        return GraduationCap;
      case 'debts':
        return CreditCard;
      default:
        return Lightbulb;
    }
  };

  const getCategoryLabel = (category: TipCategory) => {
    const labels: Record<TipCategory, string> = {
      all: 'Todas',
      income: 'Renda Extra',
      savings: 'Economia Doméstica',
      investments: 'Investimentos',
      debts: 'Gestão de Dívidas',
    };
    return labels[category];
  };

  const filteredTips = selectedCategory === 'all' 
    ? allTips 
    : allTips.filter(tip => tip.category === selectedCategory);

  const currentTip = filteredTips[currentTipIndex];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  // Resetar índice quando mudar categoria
  useEffect(() => {
    setCurrentTipIndex(0);
  }, [selectedCategory]);

  if (!currentTip) return null;

  const TipIcon = currentTip.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dicas do Pigman
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Consultoria Financeira Integral - Seu mentor financeiro
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Categorias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {(['all', 'income', 'savings', 'investments', 'debts'] as TipCategory[]).map((category) => {
          const CategoryIcon = getCategoryIcon(category);
          const isActive = selectedCategory === category;
          
          return (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-brand-pink text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <CategoryIcon className="w-4 h-4" />
              {getCategoryLabel(category)}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Card da Dica Atual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`rounded-card-lg p-6 shadow-soft border-2 ${
            currentTip.category === 'income'
              ? 'bg-brand-green/5 border-brand-green/20'
              : currentTip.category === 'savings'
              ? 'bg-brand-pink/5 border-brand-pink/20'
              : currentTip.category === 'investments'
              ? 'bg-blue-500/5 border-blue-500/20'
              : 'bg-brand-yellow/5 border-brand-yellow/20'
          }`}
        >
          {/* Header do Card */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-card flex items-center justify-center ${
                currentTip.category === 'income'
                  ? 'bg-brand-green/10'
                  : currentTip.category === 'savings'
                  ? 'bg-brand-pink/10'
                  : currentTip.category === 'investments'
                  ? 'bg-blue-500/10'
                  : 'bg-brand-yellow/10'
              }`}>
                <TipIcon className={`w-6 h-6 ${
                  currentTip.category === 'income'
                    ? 'text-brand-green'
                    : currentTip.category === 'savings'
                    ? 'text-brand-pink'
                    : currentTip.category === 'investments'
                    ? 'text-blue-500'
                    : 'text-brand-yellow'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentTip.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {currentTip.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {currentTip.priority === 'high' && (
              <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold">
                Prioridade
              </span>
            )}
          </div>

          {/* Descrição */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {currentTip.description}
          </p>

          {/* Navegação */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTip}
                className="p-2 rounded-card bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                disabled={filteredTips.length <= 1}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <span className="text-sm text-gray-500 dark:text-gray-400 px-3">
                {currentTipIndex + 1} / {filteredTips.length}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTip}
                className="p-2 rounded-card bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                disabled={filteredTips.length <= 1}
              >
                <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
            <div className="flex gap-1">
              {filteredTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTipIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTipIndex
                      ? 'bg-brand-pink w-6'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lista de Todas as Dicas (Resumo) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Todas as Dicas ({filteredTips.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredTips.map((tip, index) => {
            const TipIcon = tip.icon;
            return (
              <motion.button
                key={tip.id}
                onClick={() => setCurrentTipIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-card border-2 transition-all ${
                  index === currentTipIndex
                    ? 'border-brand-pink bg-brand-pink/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TipIcon className={`w-5 h-5 ${
                    tip.category === 'income'
                      ? 'text-brand-green'
                      : tip.category === 'savings'
                      ? 'text-brand-pink'
                      : tip.category === 'investments'
                      ? 'text-blue-500'
                      : 'text-brand-yellow'
                  }`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {tip.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {tip.description}
                    </p>
                  </div>
                  {tip.priority === 'high' && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

