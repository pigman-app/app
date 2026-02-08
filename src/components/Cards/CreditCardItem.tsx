import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { CreditCard as CreditCardType } from '../../mocks/finances';

interface CreditCardItemProps {
  card: CreditCardType;
  index: number;
}

export default function CreditCardItem({ card, index }: CreditCardItemProps) {
  const usagePercentage = (card.used / card.limit) * 100;
  
  // Determinar cor da barra baseado no uso
  const getProgressColor = () => {
    if (usagePercentage >= 80) return 'bg-brand-pink';
    if (usagePercentage >= 50) return 'bg-brand-yellow';
    return 'bg-brand-green';
  };

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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg overflow-hidden shadow-soft-shadow"
    >
      {/* Card Visual (Imitando cartão físico) */}
      <div className={`${card.cardColor} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{card.bankLogo}</span>
            </div>
            <CreditCard className="w-8 h-8 opacity-80" />
          </div>
          
          <div className="mb-4">
            <p className="text-sm opacity-80 mb-2">Número do Cartão</p>
            <p className="text-lg font-mono tracking-wider">{card.cardNumber}</p>
          </div>
          
          <div>
            <p className="text-xs opacity-80 mb-1">Titular</p>
            <p className="text-sm font-semibold">{card.cardholderName}</p>
          </div>
        </div>
      </div>

      {/* Informações Detalhadas */}
      <div className="p-6 space-y-4">
        {/* Barra de Progresso do Limite */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Limite Utilizado
            </span>
            <span className={`text-sm font-bold ${
              usagePercentage >= 80 
                ? 'text-brand-pink' 
                : usagePercentage >= 50 
                ? 'text-brand-yellow' 
                : 'text-brand-green'
            }`}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full ${getProgressColor()} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Limite Total</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {formatCurrency(card.limit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor em Aberto</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {formatCurrency(card.used)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Limite Disponível</p>
            <p className="text-base font-semibold text-brand-green">
              {formatCurrency(card.available)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              usagePercentage >= 80 
                ? 'bg-brand-pink/20 text-brand-pink' 
                : usagePercentage >= 50 
                ? 'bg-brand-yellow/20 text-brand-yellow' 
                : 'bg-brand-green/20 text-brand-green'
            }`}>
              {usagePercentage >= 80 ? 'Crítico' : usagePercentage >= 50 ? 'Atenção' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Datas */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fechamento</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {card.closingDate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vencimento</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {card.dueDate}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-brand-pink text-white font-semibold py-3 rounded-card text-sm shadow-soft hover:bg-pink-600 transition-colors"
          >
            Registrar Pagamento
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-card text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Antecipar Fatura
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}



