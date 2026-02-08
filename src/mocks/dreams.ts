export interface Dream {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlySavings: number;
  deadline: number; // meses
  startDate: Date;
  icon: string;
  unlocksElo: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Mestre';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export const dreamsData: Dream[] = [
  {
    id: '1',
    title: 'Viagem para a Europa',
    targetAmount: 25000.00,
    currentAmount: 16250.00,
    monthlySavings: 1200.00,
    deadline: 12,
    startDate: new Date('2024-01-01'),
    icon: '✈️',
    unlocksElo: 'Ouro',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Carro Novo',
    targetAmount: 50000.00,
    currentAmount: 15000.00,
    monthlySavings: 3500.00,
    deadline: 14,
    startDate: new Date('2024-03-01'),
    icon: '🚗',
    unlocksElo: 'Platina',
    status: 'active',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '3',
    title: 'Apartamento Próprio',
    targetAmount: 200000.00,
    currentAmount: 24000.00,
    monthlySavings: 4200.00,
    deadline: 48,
    startDate: new Date('2024-06-01'),
    icon: '🏠',
    unlocksElo: 'Mestre',
    status: 'active',
    createdAt: new Date('2024-06-01'),
  },
];

// Calcular progresso de cada sonho
export const getDreamProgress = (dream: Dream): number => {
  return Math.min(100, (dream.currentAmount / dream.targetAmount) * 100);
};

// Calcular meses restantes
export const getRemainingMonths = (dream: Dream): number => {
  const monthsElapsed = Math.floor(
    (Date.now() - dream.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return Math.max(0, dream.deadline - monthsElapsed);
};




