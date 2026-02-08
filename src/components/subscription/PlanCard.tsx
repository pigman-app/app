import { motion } from 'framer-motion';
import { Check, Lock, Sparkles } from 'lucide-react';
import { SubscriptionPlan } from '../../mocks/settings';
import { 
  Edit, 
  MessageCircle, 
  FileText, 
  FileSpreadsheet, 
  Link,
  LucideIcon 
} from 'lucide-react';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrent: boolean;
  onUpgrade?: (planId: string) => void;
  index: number;
}

const iconMap: Record<string, LucideIcon> = {
  Edit,
  MessageCircle,
  FileText,
  FileSpreadsheet,
  Link,
};

export default function PlanCard({ plan, isCurrent, onUpgrade, index }: PlanCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow ${
        plan.recommended ? 'ring-2 ring-brand-yellow' : ''
      } ${isCurrent ? 'border-2 border-brand-pink' : ''} ${
        plan.recommended || isCurrent ? 'pt-8' : ''
      }`}
      style={{ zIndex: 1 }}
    >
      {/* Badge Recomendado */}
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[100]" style={{ pointerEvents: 'none' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-brand-yellow text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            Recomendado
          </motion.div>
        </div>
      )}

      {/* Badge Plano Atual */}
      {isCurrent && !plan.recommended && (
        <div className="absolute -top-4 right-4 z-[100]" style={{ pointerEvents: 'none' }}>
          <div className="bg-brand-pink text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
            Seu Plano
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {plan.features.map((feature) => {
          const Icon = iconMap[feature.icon] || Edit;
          const isAvailable = feature.available && !feature.locked;

          return (
            <div
              key={feature.id}
              className={`flex items-start gap-3 p-3 rounded-card ${
                !isAvailable ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                isAvailable 
                  ? 'bg-brand-green/20 text-brand-green' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
              }`}>
                {isAvailable ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon 
                    className={`w-4 h-4 ${
                      isAvailable 
                        ? 'text-brand-pink fill-brand-pink' 
                        : 'text-gray-400'
                    }`} 
                  />
                  <p className={`text-sm font-medium ${
                    isAvailable 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-400'
                  }`}>
                    {feature.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      {!isCurrent && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onUpgrade?.(plan.id)}
          className={`w-full py-3 rounded-card font-semibold transition-colors ${
            plan.recommended
              ? 'bg-brand-yellow text-gray-900 hover:bg-yellow-500'
              : 'bg-brand-pink text-white hover:bg-pink-600'
          } shadow-soft-shadow`}
        >
          {plan.price === 0 ? 'Começar Grátis' : 'Upgrade'}
        </motion.button>
      )}

      {isCurrent && (
        <div className="w-full py-3 rounded-card font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-center">
          Plano Atual
        </div>
      )}
    </motion.div>
  );
}



