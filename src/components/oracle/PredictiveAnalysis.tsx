import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PredictionData } from '../../mocks/strategy';

interface PredictiveAnalysisProps {
  data: PredictionData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-card shadow-soft border border-gray-200 dark:border-gray-700">
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PredictiveAnalysis({ data }: PredictiveAnalysisProps) {
  // Dados para o gráfico (últimos 7 dias + projeção)
  const chartData = [
    { day: 'Dia 1', Real: 570.61, Previsto: 600.00 },
    { day: 'Dia 5', Real: 1200.00, Previsto: 1100.00 },
    { day: 'Dia 10', Real: 1800.50, Previsto: 1600.00 },
    { day: 'Dia 15', Real: 2400.00, Previsto: 2000.00 },
    { day: 'Hoje', Real: data.current, Previsto: data.predicted },
    { day: 'Fim Mês', Real: null, Previsto: data.endOfMonth },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-brand-green" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-brand-pink" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Análise Preditiva
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real vs. Previsto - Projeção do Mês
          </p>
        </div>
        {getTrendIcon()}
      </div>

      {/* Gráfico */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Real"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ fill: '#22C55E', r: 4 }}
              name="Realizado"
            />
            <Line
              type="monotone"
              dataKey="Previsto"
              stroke="#EC4899"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#EC4899', r: 4 }}
              name="Previsto (IA)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo Atual</p>
          <p className="text-lg font-bold text-brand-green">
            {formatCurrency(data.current)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Projeção Fim do Mês</p>
          <p className="text-lg font-bold text-brand-pink">
            {formatCurrency(data.endOfMonth)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}



