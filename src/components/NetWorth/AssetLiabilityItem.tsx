import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  TrendingUp, 
  Home, 
  CreditCard,
  LucideIcon,
  Edit,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Asset, Liability } from '../../mocks/finances';
import { useState } from 'react';

interface AssetLiabilityItemProps {
  item: Asset | Liability;
  index: number;
  type: 'asset' | 'liability';
  onEdit?: (item: Asset | Liability) => void;
  onView?: (item: Asset | Liability) => void;
}

const iconMap: Record<string, LucideIcon> = {
  PiggyBank,
  TrendingUp,
  Home,
  CreditCard,
};

export default function AssetLiabilityItem({ 
  item, 
  index, 
  type,
  onEdit,
  onView
}: AssetLiabilityItemProps) {
  const Icon = iconMap[item.icon] || CreditCard;
  const isAsset = type === 'asset';
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isAsset ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft flex items-center gap-4 relative"
    >
      <div className={`w-12 h-12 rounded-card flex items-center justify-center ${
        isAsset 
          ? 'bg-brand-green/10 dark:bg-brand-green/20' 
          : 'bg-brand-pink/10 dark:bg-brand-pink/20'
      }`}>
        <Icon 
          className={`w-6 h-6 ${
            isAsset ? 'text-brand-green' : 'text-brand-pink'
          }`} 
        />
      </div>
      
      <div className="flex-1" onClick={() => onView?.(item)}>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">
          {item.name}
        </p>
        <p className={`text-lg font-bold mt-1 ${
          isAsset ? 'text-brand-green' : 'text-brand-pink'
        }`}>
          {formatCurrency(item.value)}
        </p>
      </div>

      {/* Menu de Ações */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-card shadow-soft border border-gray-200 dark:border-gray-700 z-10 min-w-[140px]"
          >
            <button
              onClick={() => {
                onView?.(item);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-card"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </button>
            <button
              onClick={() => {
                onEdit?.(item);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-b-card"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </motion.div>
        )}
      </div>

      {/* Overlay para fechar menu ao clicar fora */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
}



