export type EloType = 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Mestre';

export interface Elo {
  name: EloType;
  focus: string;
  xpRequired: number;
  description: string;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'achievement';
  reward: {
    xp: number;
    coins?: number;
  };
}

export interface GamificationData {
  currentElo: EloType;
  nextElo: EloType;
  eloProgress: number; // 0-100
  xp: number;
  xpToNext: number;
  level: number;
  streak: number; // Ofensiva (dias consecutivos)
  missions: Mission[];
  healthFocus: string;
  dailyGoalMet: boolean;
}

export const elos: Elo[] = [
  {
    name: 'Bronze',
    focus: 'Sobrevivência e Estanque de Dívidas',
    xpRequired: 0,
    description: 'Primeiros passos na jornada financeira',
    icon: '🥉',
  },
  {
    name: 'Prata',
    focus: 'Criar o primeiro fôlego de reserva',
    xpRequired: 1000,
    description: 'Construindo sua base financeira',
    icon: '🥈',
  },
  {
    name: 'Ouro',
    focus: 'Multiplicar patrimônio',
    xpRequired: 2500,
    description: 'Acelerando o crescimento',
    icon: '🥇',
  },
  {
    name: 'Platina',
    focus: 'Independência financeira',
    xpRequired: 5000,
    description: 'Próximo nível de liberdade',
    icon: '💎',
  },
  {
    name: 'Mestre',
    focus: 'Liberdade absoluta',
    xpRequired: 10000,
    description: 'Soberania financeira conquistada',
    icon: '👑',
  },
];

export const gamificationData: GamificationData = {
  currentElo: 'Bronze',
  nextElo: 'Prata',
  eloProgress: 65, // 65% para o Prata
  xp: 650,
  xpToNext: 1000,
  level: 1,
  streak: 12, // 12 dias de ofensiva
  missions: [
    {
      id: '1',
      title: 'Sentinela',
      description: 'Registrar 5 gastos no dia',
      progress: 3,
      total: 5,
      completed: false,
      type: 'daily',
      reward: {
        xp: 50,
        coins: 10,
      },
    },
    {
      id: '2',
      title: 'Poupador Iniciante',
      description: 'Guardar R$ 100,00 na reserva',
      progress: 100,
      total: 100,
      completed: true,
      type: 'achievement',
      reward: {
        xp: 100,
        coins: 25,
      },
    },
    {
      id: '3',
      title: 'Visão de Futuro',
      description: 'Criar um novo "Sonho" no Mapa de Metas',
      progress: 0,
      total: 1,
      completed: false,
      type: 'weekly',
      reward: {
        xp: 75,
        coins: 15,
      },
    },
  ],
  healthFocus: 'Foco: Criar o primeiro fôlego de reserva',
  dailyGoalMet: false, // Meta diária não foi batida ainda
};



