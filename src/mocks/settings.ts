export type PlanTier = 'Starter' | 'Pro' | 'Elite';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  locked?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: PlanTier;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  color: string;
}

export interface UserSettings {
  currentPlan: PlanTier;
  userName: string;
  email: string;
  avatar: string;
  elo: string;
  permissions: {
    canImportPDF: boolean;
    canImportXLS: boolean;
    canConnectBank: boolean;
    canUseWhatsApp: boolean;
    canUseAI: boolean;
  };
}

export const plans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'monthly',
    description: 'Foco em lançamentos manuais e WhatsApp',
    color: 'gray',
    features: [
      {
        id: 'manual-entry',
        name: 'Lançamentos Manuais',
        description: 'Registre suas transações manualmente',
        icon: 'Edit',
        available: true,
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Integração via chat',
        icon: 'MessageCircle',
        available: true,
      },
      {
        id: 'pdf-import',
        name: 'Importação de PDF',
        description: 'Leitura automática de faturas',
        icon: 'FileText',
        available: false,
        locked: true,
      },
      {
        id: 'xls-import',
        name: 'Importação XLS',
        description: 'Upload de planilhas Excel',
        icon: 'FileSpreadsheet',
        available: false,
        locked: true,
      },
      {
        id: 'bank-connection',
        name: 'Conexão Bancária',
        description: 'Sincronização automática via API',
        icon: 'Link',
        available: false,
        locked: true,
      },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.90,
    period: 'monthly',
    description: 'Destaque para leitura de PDFs e faturas XLS',
    color: 'yellow',
    recommended: true,
    features: [
      {
        id: 'manual-entry',
        name: 'Lançamentos Manuais',
        description: 'Registre suas transações manualmente',
        icon: 'Edit',
        available: true,
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Integração via chat',
        icon: 'MessageCircle',
        available: true,
      },
      {
        id: 'pdf-import',
        name: 'Importação de PDF',
        description: 'Leitura automática de faturas',
        icon: 'FileText',
        available: true,
      },
      {
        id: 'xls-import',
        name: 'Importação XLS',
        description: 'Upload de planilhas Excel',
        icon: 'FileSpreadsheet',
        available: true,
      },
      {
        id: 'bank-connection',
        name: 'Conexão Bancária',
        description: 'Sincronização automática via API',
        icon: 'Link',
        available: false,
        locked: true,
      },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 79.90,
    period: 'monthly',
    description: 'Sincronização automática via API bancária em tempo real',
    color: 'pink',
    features: [
      {
        id: 'manual-entry',
        name: 'Lançamentos Manuais',
        description: 'Registre suas transações manualmente',
        icon: 'Edit',
        available: true,
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'Integração via chat',
        icon: 'MessageCircle',
        available: true,
      },
      {
        id: 'pdf-import',
        name: 'Importação de PDF',
        description: 'Leitura automática de faturas',
        icon: 'FileText',
        available: true,
      },
      {
        id: 'xls-import',
        name: 'Importação XLS',
        description: 'Upload de planilhas Excel',
        icon: 'FileSpreadsheet',
        available: true,
      },
      {
        id: 'bank-connection',
        name: 'Conexão Bancária',
        description: 'Sincronização automática via API',
        icon: 'Link',
        available: true,
      },
    ],
  },
];

export const userSettings: UserSettings = {
  currentPlan: 'Starter',
  userName: 'João Silva',
  email: 'joao@pigman.com',
  avatar: '🐷',
  elo: 'Bronze',
  permissions: {
    canImportPDF: false,
    canImportXLS: false,
    canConnectBank: false,
    canUseWhatsApp: true,
    canUseAI: true,
  },
};



