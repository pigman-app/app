export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PigMan {
  elo: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Mestre';
  xp: number;
  xpToNext: number;
  level: number;
}

export interface Card {
  id: string;
  name: string;
  lastFour: string;
  balance: number;
  type: 'credit' | 'debit';
}

export interface Balance {
  total: number;
  available: number;
  invested: number;
}

export interface MockData {
  user: User;
  pigMan: PigMan;
  cards: Card[];
  balance: Balance;
}

export const mockData: MockData = {
  user: {
    id: '1',
    name: 'João Silva',
    email: 'joao@pigman.com',
  },
  pigMan: {
    elo: 'Bronze',
    xp: 250,
    xpToNext: 500,
    level: 1,
  },
  cards: [
    {
      id: '1',
      name: 'Cartão Principal',
      lastFour: '1234',
      balance: 1250.50,
      type: 'credit',
    },
    {
      id: '2',
      name: 'Cartão Secundário',
      lastFour: '5678',
      balance: 500.00,
      type: 'debit',
    },
  ],
  balance: {
    total: 15000.00,
    available: 12000.00,
    invested: 3000.00,
  },
};



