export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  icon: string;
  color: string;
}

export interface BudgetStatus {
  status: 'safe' | 'warning' | 'danger';
  percentage: number;
  message: string;
}

export const budgetsData: Budget[] = [
  {
    id: '1',
    category: 'Alimentação',
    limit: 1000.00,
    spent: 640.00,
    icon: '🍽️',
    color: '#22C55E',
  },
  {
    id: '2',
    category: 'Lazer',
    limit: 800.00,
    spent: 720.00,
    icon: '🎮',
    color: '#EAB308',
  },
  {
    id: '3',
    category: 'Transporte',
    limit: 500.00,
    spent: 500.00,
    icon: '🚗',
    color: '#EC4899',
  },
  {
    id: '4',
    category: 'Saúde',
    limit: 400.00,
    spent: 300.20,
    icon: '🏥',
    color: '#22C55E',
  },
  {
    id: '5',
    category: 'Moradia',
    limit: 2000.00,
    spent: 1500.00,
    icon: '🏠',
    color: '#22C55E',
  },
  {
    id: '6',
    category: 'Educação',
    limit: 600.00,
    spent: 450.00,
    icon: '📚',
    color: '#22C55E',
  },
];

export const getBudgetStatus = (budget: Budget): BudgetStatus => {
  const percentage = (budget.spent / budget.limit) * 100;
  
  if (percentage >= 90) {
    return {
      status: 'danger',
      percentage,
      message: '🔴 Limite atingido!',
    };
  } else if (percentage >= 70) {
    return {
      status: 'warning',
      percentage,
      message: '⚠️ Atenção - 10% restante',
    };
  } else {
    return {
      status: 'safe',
      percentage,
      message: `${Math.round(100 - percentage)}% disponível`,
    };
  }
};

export const getBudgetColor = (status: BudgetStatus): string => {
  switch (status.status) {
    case 'danger':
      return '#EC4899'; // Rosa/Pink
    case 'warning':
      return '#EAB308'; // Amarelo
    default:
      return '#22C55E'; // Verde
  }
};





