import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DebtStrategy as DebtStrategyType } from '../../mocks/strategy';

interface DebtStrategyProps {
  data: DebtStrategyType;
}

export default function DebtStrategy({ data }: DebtStrategyProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-brand-pink bg-brand-pink/10';
      case 'medium':
        return 'text-brand-yellow bg-brand-yellow/10';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      default:
        return 'Baixa';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-brand-pink" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Rota de Fuga
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estratégia de Quitação de Dívidas
          </p>
        </div>
      </div>

      {/* Total e Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-card p-4">
          <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Total de Dívidas</span>
          <span className="text-xl font-bold text-brand-pink">
            {formatCurrency(data.totalDebt)}
          </span>
        </div>
        <div className="bg-brand-green/10 dark:bg-brand-green/20 rounded-card p-4 border border-brand-green/20">
          <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Economia em Juros</span>
          <span className="text-xl font-bold text-brand-green">
            {formatCurrency(data.totalDebt * 0.4)} {/* Estimativa de 40% */}
          </span>
        </div>
        <div className="bg-brand-yellow/10 dark:bg-brand-yellow/20 rounded-card p-4 border border-brand-yellow/20">
          <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Tempo Total</span>
          <span className="text-xl font-bold text-brand-yellow">
            {Math.max(...data.debts.map(d => d.monthsToPay))} meses
          </span>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Timeline de Quitação:
        </h4>
        <div className="relative">
          {/* Linha da Timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
          
          <div className="space-y-6 pl-12">
            {data.debts
              .sort((a, b) => {
                const orderA = data.recommendedOrder.indexOf(a.name);
                const orderB = data.recommendedOrder.indexOf(b.name);
                return orderA - orderB;
              })
              .map((debt, index) => {
                const startMonth = index === 0 ? 1 : 
                  data.debts
                    .slice(0, index)
                    .reduce((sum, d) => sum + d.monthsToPay, 1);
                const endMonth = startMonth + debt.monthsToPay - 1;

                return (
                  <motion.div
                    key={debt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Ponto na Timeline */}
                    <div className="absolute -left-8 top-2 w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-soft">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>

                    {/* Card do Período */}
                    <div className="bg-gradient-to-r from-brand-pink/10 to-brand-pink/5 dark:from-brand-pink/20 dark:to-brand-pink/10 border border-brand-pink/20 rounded-card p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {debt.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Mês {startMonth} - {endMonth}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(debt.priority)}`}>
                          {getPriorityLabel(debt.priority)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(debt.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pagamento/mês</p>
                          <p className="text-sm font-bold text-brand-green">
                            {formatCurrency(debt.suggestedPayment)}
                          </p>
                        </div>
                      </div>

                      {/* Barra de Progresso do Período */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progresso do período</span>
                          <span>{debt.monthsToPay} meses</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                            className="h-full bg-brand-pink rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Comparação: Sem Estratégia vs Com Estratégia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-card p-4">
          <h5 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
            Sem Estratégia
          </h5>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Pagando todas as dívidas simultaneamente
          </p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(data.totalDebt * 1.6)} {/* Estimativa sem otimização */}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total com juros
          </p>
        </div>
        <div className="bg-brand-green/10 dark:bg-brand-green/20 border border-brand-green/20 rounded-card p-4">
          <h5 className="text-sm font-semibold text-brand-green mb-2">
            Com Estratégia IA
          </h5>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Plano otimizado de quitação
          </p>
          <p className="text-lg font-bold text-brand-green">
            {formatCurrency(data.totalDebt * 1.2)} {/* Estimativa com otimização */}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total com juros
          </p>
        </div>
      </div>
    </motion.div>
  );
}

