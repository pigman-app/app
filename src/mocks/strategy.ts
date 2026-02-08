export interface PredictionData {
  current: number;
  predicted: number;
  endOfMonth: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SimulationGoal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: number; // meses
  monthlySavings: number;
  insights: string[];
  suggestedCuts: {
    category: string;
    current: number;
    suggested: number;
    percentage: number;
  }[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

export interface DebtStrategy {
  debts: {
    id: string;
    name: string;
    amount: number;
    interest: number;
    priority: 'high' | 'medium' | 'low';
    suggestedPayment: number;
    monthsToPay: number;
  }[];
  totalDebt: number;
  recommendedOrder: string[];
}

export const predictionData: PredictionData = {
  current: 2802.94,
  predicted: 2124.37,
  endOfMonth: 1200.00, // Saldo positivo projetado
  trend: 'up',
};

export const europeSimulation: SimulationGoal = {
  id: '1',
  title: 'Viagem para a Europa',
  targetAmount: 25000.00,
  deadline: 12,
  monthlySavings: 2083.33,
  insights: [
    'Comandante, se reduzirmos 15% do Lazer, antecipamos sua meta em 2 meses.',
    'Com o seu fluxo atual, você pode atingir este objetivo em 12 meses.',
  ],
  suggestedCuts: [
    {
      category: 'Lazer',
      current: 500.00,
      suggested: 425.00,
      percentage: 15,
    },
    {
      category: 'Alimentação',
      current: 1200.00,
      suggested: 1100.00,
      percentage: 8,
    },
    {
      category: 'Transporte',
      current: 450.00,
      suggested: 400.00,
      percentage: 11,
    },
  ],
};

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Olá, Comandante! 👋 Estou aqui para ajudar você a dominar suas finanças. Como posso ajudar hoje?',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    type: 'user',
    content: 'Gastei R$ 50 no mercado',
    timestamp: new Date(Date.now() - 1800000),
    isAudio: false,
  },
  {
    id: '3',
    type: 'ai',
    content: '✅ Lançamento registrado! Categoria: Alimentação. Seu saldo atual é R$ 2.752,94. Continue assim, Comandante! 🐷',
    timestamp: new Date(Date.now() - 1700000),
  },
  {
    id: '4',
    type: 'user',
    content: 'Como está minha situação financeira?',
    timestamp: new Date(Date.now() - 900000),
    isAudio: true,
  },
  {
    id: '5',
    type: 'ai',
    content: '📊 Análise rápida: Você está no Elo Bronze com 65% de progresso. Sua projeção para o fim do mês é positiva: R$ 1.200,00. Mantenha o foco na sua meta de reserva! 💪',
    timestamp: new Date(Date.now() - 800000),
  },
];

export const debtStrategy: DebtStrategy = {
  debts: [
    {
      id: '1',
      name: 'Cartão de Crédito - Nubank',
      amount: 2800.00,
      interest: 12.5,
      priority: 'high',
      suggestedPayment: 500.00,
      monthsToPay: 6,
    },
    {
      id: '2',
      name: 'Financiamento Imobiliário',
      amount: 12000.00,
      interest: 8.5,
      priority: 'medium',
      suggestedPayment: 1500.00,
      monthsToPay: 8,
    },
    {
      id: '3',
      name: 'Cartão de Crédito - Inter',
      amount: 2466.90,
      interest: 11.2,
      priority: 'high',
      suggestedPayment: 450.00,
      monthsToPay: 6,
    },
  ],
  totalDebt: 17266.90,
  recommendedOrder: [
    'Cartão de Crédito - Nubank',
    'Cartão de Crédito - Inter',
    'Financiamento Imobiliário',
  ],
};



