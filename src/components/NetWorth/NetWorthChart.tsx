import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NetWorthChartProps {
  assetsTotal: number;
  liabilitiesTotal: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-card shadow-soft border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm text-brand-pink font-medium">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function NetWorthChart({ assetsTotal, liabilitiesTotal }: NetWorthChartProps) {
  const data = [
    { name: 'Ativos', value: assetsTotal, color: '#22C55E' },
    { name: 'Passivos', value: liabilitiesTotal, color: '#EC4899' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Visão Geral do Patrimônio
      </h3>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}



