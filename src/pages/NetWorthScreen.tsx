import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { netWorthData } from '../mocks/finances';
import NetWorthChart from '../components/NetWorth/NetWorthChart';
import AssetLiabilityItem from '../components/NetWorth/AssetLiabilityItem';
import EloEvolutionCard from '../components/NetWorth/EloEvolutionCard';

export default function NetWorthScreen() {
  const assetsTotal = netWorthData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const liabilitiesTotal = netWorthData.liabilities.reduce((sum, liability) => sum + liability.value, 0);
  
  // Calcular progresso para evolução do Elo (exemplo: 0-100% baseado no net worth)
  // Assumindo que R$ 10.000+ leva para Prata
  const eloProgress = Math.min(100, (netWorthData.netWorth / 10000) * 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

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
            Patrimônio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visão completa dos seus ativos e passivos
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-brand-green" />
        </div>
      </motion.div>

      {/* Net Worth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Patrimônio Líquido
        </p>
        <h2 className={`text-3xl font-bold mb-4 ${
          netWorthData.netWorth >= 0 
            ? 'text-brand-green' 
            : 'text-brand-pink'
        }`}>
          {formatCurrency(netWorthData.netWorth)}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total de Ativos</p>
            <p className="font-semibold text-brand-green">
              {formatCurrency(assetsTotal)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total de Passivos</p>
            <p className="font-semibold text-brand-pink">
              {formatCurrency(liabilitiesTotal)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Gestão */}
      <NetWorthChart 
        assetsTotal={assetsTotal} 
        liabilitiesTotal={liabilitiesTotal} 
      />

      {/* Card de Evolução do Elo */}
      <EloEvolutionCard
        currentElo="Bronze"
        nextElo="Prata"
        netWorth={netWorthData.netWorth}
        progress={eloProgress}
      />

      {/* Lista de Ativos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ativos
        </h2>
        <div className="space-y-3">
          {netWorthData.assets.map((asset, index) => (
            <AssetLiabilityItem
              key={asset.id}
              item={asset}
              index={index}
              type="asset"
            />
          ))}
        </div>
      </div>

      {/* Lista de Passivos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Passivos
        </h2>
        <div className="space-y-3">
          {netWorthData.liabilities.map((liability, index) => (
            <AssetLiabilityItem
              key={liability.id}
              item={liability}
              index={index}
              type="liability"
            />
          ))}
        </div>
      </div>
    </div>
  );
}



