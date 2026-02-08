import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  TrendingUp, 
  Home, 
  CreditCard,
  LucideIcon 
} from 'lucide-react';
import { Asset, Liability } from '../../mocks/finances';

interface AssetLiabilityItemProps {
  item: Asset | Liability;
  index: number;
  type: 'asset' | 'liability';
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
  type 
}: AssetLiabilityItemProps) {
  const Icon = iconMap[item.icon] || CreditCard;
  const isAsset = type === 'asset';

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
      className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft flex items-center gap-4"
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
      
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">
          {item.name}
        </p>
        <p className={`text-lg font-bold mt-1 ${
          isAsset ? 'text-brand-green' : 'text-brand-pink'
        }`}>
          {formatCurrency(item.value)}
        </p>
      </div>
    </motion.div>
  );
}



