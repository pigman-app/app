export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'emergency' | 'investment' | 'property' | 'other';
  icon: string;
  description?: string;
  date?: string;
  notes?: string;
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  type: 'loan' | 'credit-card' | 'financing' | 'other';
  icon: string;
  description?: string;
  date?: string;
  notes?: string;
  interestRate?: number;
  installments?: number;
  totalInstallments?: number;
}

export interface NetWorthData {
  assets: Asset[];
  liabilities: Liability[];
  netWorth: number;
}

export interface CreditCard {
  id: string;
  bank: string;
  bankLogo: string;
  cardColor: string;
  cardNumber: string;
  cardholderName: string;
  limit: number;
  used: number;
  available: number;
  closingDate: string; // DD/MM
  dueDate: string; // DD/MM
}

export const netWorthData: NetWorthData = {
  assets: [
    {
      id: '1',
      name: 'Reserva de Emergência',
      value: 15000.00,
      type: 'emergency',
      icon: 'PiggyBank',
    },
    {
      id: '2',
      name: 'Ações',
      value: 5000.00,
      type: 'investment',
      icon: 'TrendingUp',
    },
  ],
  liabilities: [
    {
      id: '1',
      name: 'Financiamento',
      value: 12000.00,
      type: 'financing',
      icon: 'Home',
    },
    {
      id: '2',
      name: 'Fatura Cartão',
      value: 2466.90,
      type: 'credit-card',
      icon: 'CreditCard',
    },
  ],
  netWorth: 0, // Será calculado abaixo
};

// Calcular Net Worth automaticamente
netWorthData.netWorth = 
  netWorthData.assets.reduce((sum, asset) => sum + asset.value, 0) -
  netWorthData.liabilities.reduce((sum, liability) => sum + liability.value, 0);

export const creditCardsData: CreditCard[] = [
  {
    id: '1',
    bank: 'Santander',
    bankLogo: 'S',
    cardColor: 'bg-red-600',
    cardNumber: '**** **** **** 1234',
    cardholderName: 'JOÃO SILVA',
    limit: 5000.00,
    used: 3500.00,
    available: 1500.00,
    closingDate: '15/12',
    dueDate: '20/12',
  },
  {
    id: '2',
    bank: 'Inter',
    bankLogo: 'I',
    cardColor: 'bg-orange-500',
    cardNumber: '**** **** **** 5678',
    cardholderName: 'JOÃO SILVA',
    limit: 8000.00,
    used: 2466.90,
    available: 5533.10,
    closingDate: '10/12',
    dueDate: '15/12',
  },
  {
    id: '3',
    bank: 'Nubank',
    bankLogo: 'N',
    cardColor: 'bg-purple-600',
    cardNumber: '**** **** **** 9012',
    cardholderName: 'JOÃO SILVA',
    limit: 3000.00,
    used: 2800.00,
    available: 200.00,
    closingDate: '05/12',
    dueDate: '10/12',
  },
];



