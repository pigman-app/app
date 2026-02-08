import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { budgetsData, getBudgetStatus, getBudgetColor } from '../../mocks/budgets';

export default function SmartBudgets() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger':
        return <XCircle className="w-5 h-5 text-brand-pink" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-brand-yellow" />;
      default:
        return <CheckCircle className="w-5 h-5 text-brand-green" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'danger':
        return 'Limite';
      case 'warning':
        return 'Atenção';
      default:
        return 'Seguro';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Orçamentos Inteligentes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Controle total com alertas automáticos
          </p>
        </div>
        <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-brand-pink" />
        </div>
      </div>

      <div className="space-y-4">
        {budgetsData.map((budget, index) => {
          const status = getBudgetStatus(budget);
          const color = getBudgetColor(status);
          const available = budget.limit - budget.spent;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`border-l-4 rounded-card-lg p-4 bg-gray-50 dark:bg-gray-700/50 ${
                status.status === 'danger'
                  ? 'border-brand-pink'
                  : status.status === 'warning'
                  ? 'border-brand-yellow'
                  : 'border-brand-green'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{budget.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {budget.category}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      status.status === 'danger'
                        ? 'bg-brand-pink/20 text-brand-pink'
                        : status.status === 'warning'
                        ? 'bg-brand-yellow/20 text-brand-yellow'
                        : 'bg-brand-green/20 text-brand-green'
                    }`}
                  >
                    {getStatusLabel(status.status)}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${status.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
                {status.percentage >= 90 && (
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
              </div>

              {/* Mensagem de Status */}
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs font-medium ${
                    status.status === 'danger'
                      ? 'text-brand-pink'
                      : status.status === 'warning'
                      ? 'text-brand-yellow'
                      : 'text-brand-green'
                  }`}
                >
                  {status.message}
                </p>
                {status.status === 'safe' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(available)} disponível
                  </p>
                )}
              </div>

              {/* Sugestão da IA quando próximo do limite */}
              {status.status !== 'safe' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                >
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💡 <strong>Sugestão da IA:</strong>{' '}
                    {status.status === 'danger'
                      ? 'Considere revisar gastos nesta categoria ou aumentar o limite.'
                      : 'Você está próximo do limite. Monitore seus gastos.'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}





