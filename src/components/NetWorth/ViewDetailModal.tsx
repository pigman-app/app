import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Calendar, FileText, Percent, Hash } from 'lucide-react';
import { Asset, Liability } from '../../mocks/finances';
import { PiggyBank, Home, CreditCard, DollarSign, TrendingUp as TrendingUpIcon } from 'lucide-react';

interface ViewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Asset | Liability;
  type: 'asset' | 'liability';
}

const iconMap: Record<string, any> = {
  PiggyBank,
  TrendingUp: TrendingUpIcon,
  Home,
  CreditCard,
  DollarSign,
};

export default function ViewDetailModal({ isOpen, onClose, item, type }: ViewDetailModalProps) {
  const Icon = iconMap[item.icon] || CreditCard;
  const isAsset = type === 'asset';
  const liability = item as Liability;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-soft-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-card flex items-center justify-center ${
                  isAsset 
                    ? 'bg-brand-green/10 dark:bg-brand-green/20' 
                    : 'bg-brand-pink/10 dark:bg-brand-pink/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isAsset ? 'text-brand-green' : 'text-brand-pink'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAsset ? 'Ativo' : 'Passivo'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Valor Principal */}
            <div className={`mb-6 p-4 rounded-card ${
              isAsset 
                ? 'bg-brand-green/10 dark:bg-brand-green/20 border border-brand-green/20' 
                : 'bg-brand-pink/10 dark:bg-brand-pink/20 border border-brand-pink/20'
            }`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor</p>
              <p className={`text-3xl font-bold ${
                isAsset ? 'text-brand-green' : 'text-brand-pink'
              }`}>
                {formatCurrency(item.value)}
              </p>
            </div>

            {/* Informações Gerais */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white ml-6">
                  {item.type === 'emergency' ? 'Reserva de Emergência' :
                   item.type === 'investment' ? 'Investimento' :
                   item.type === 'property' ? 'Propriedade' :
                   item.type === 'loan' ? 'Empréstimo' :
                   item.type === 'credit-card' ? 'Cartão de Crédito' :
                   item.type === 'financing' ? 'Financiamento' :
                   'Outro'}
                </p>
              </div>

              {item.description && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descrição
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white ml-6">
                    {item.description}
                  </p>
                </div>
              )}

              {item.date && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white ml-6">
                    {formatDate(item.date)}
                  </p>
                </div>
              )}
            </div>

            {/* Informações Específicas de Passivo */}
            {!isAsset && (
              <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-card">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Detalhes do Passivo
                </h4>
                
                {liability.interestRate !== undefined && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Taxa de Juros
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white ml-6">
                      {liability.interestRate.toFixed(2)}% ao mês
                    </p>
                  </div>
                )}

                {liability.installments !== undefined && liability.totalInstallments !== undefined && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Parcelas
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white ml-6">
                      {liability.installments} de {liability.totalInstallments}
                      {liability.totalInstallments > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {' '}({((liability.installments / liability.totalInstallments) * 100).toFixed(0)}% pago)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Observações */}
            {item.notes && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Observações
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {item.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Botão Fechar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-card text-white font-semibold shadow-soft-shadow transition-colors ${
                isAsset
                  ? 'bg-brand-green hover:bg-green-600'
                  : 'bg-brand-pink hover:bg-pink-600'
              }`}
            >
              Fechar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

