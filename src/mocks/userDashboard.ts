export interface DashboardData {
  balance: {
    initial: number;
    current: number;
    predicted: number;
  };
  real: {
    balance: number;
    income: number;
    expenses: number;
  };
  predicted: {
    balance: number;
    income: number;
    expenses: number;
  };
  pigMan: {
    elo: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Mestre';
    xp: number;
    xpToNext: number;
    level: number;
    streak: number; // Ofensiva (dias consecutivos)
  };
  pendingExpenses: {
    count: number;
    total: number;
  };
  expensesByCategory: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const dashboardData: DashboardData = {
  balance: {
    initial: 570.61,
    current: 2802.94,
    predicted: 2124.37,
  },
  real: {
    balance: 2802.94,
    income: 5000.00,
    expenses: 2767.67,
  },
  predicted: {
    balance: 2124.37,
    income: 4500.00,
    expenses: 2946.24,
  },
  pigMan: {
    elo: 'Bronze',
    xp: 450,
    xpToNext: 1000,
    level: 1,
    streak: 12, // 12 dias de ofensiva
  },
  pendingExpenses: {
    count: 27,
    total: 3746.95,
  },
  expensesByCategory: [
    { name: 'Alimentação', value: 1200.50, color: '#22C55E' },
    { name: 'Moradia', value: 1500.00, color: '#EC4899' },
    { name: 'Transporte', value: 450.75, color: '#EAB308' },
    { name: 'Saúde', value: 300.20, color: '#3B82F6' },
    { name: 'Lazer', value: 295.50, color: '#8B5CF6' },
  ],
};



