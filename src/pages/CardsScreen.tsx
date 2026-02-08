import { motion } from 'framer-motion';
import { CreditCard as CreditCardIcon, ArrowLeft } from 'lucide-react';
import { creditCardsData } from '../mocks/finances';
import CreditCardItem from '../components/Cards/CreditCardItem';

interface CardsScreenProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards') => void;
}

export default function CardsScreen({ onNavigate }: CardsScreenProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate?.('home')}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cartões de Crédito
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie seus cartões e limites
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <CreditCardIcon className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Resumo Geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Limite Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
              }).format(
                creditCardsData.reduce((sum, card) => sum + card.limit, 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Utilizado</p>
            <p className="text-xl font-bold text-brand-pink">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
              }).format(
                creditCardsData.reduce((sum, card) => sum + card.used, 0)
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lista de Cartões */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Meus Cartões
        </h2>
        {creditCardsData.map((card, index) => (
          <CreditCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}

