export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string; // Código do banco (ex: 001, 341, etc)
  accountType: 'checking' | 'savings' | 'investment';
  accountNumber: string;
  agency: string;
  holderName: string;
  isConnected: boolean;
  lastSync?: string;
  balance?: number;
  logo?: string; // URL ou nome do logo
}

// Logos dos bancos
// Quando você adicionar as imagens na pasta src/assets/banks/, elas serão carregadas automaticamente
// Os caminhos são relativos à pasta public ou podem ser importados diretamente

export const bankLogos: Record<string, string> = {
  '001': '/assets/banks/bb.png', // Banco do Brasil
  '033': '/assets/banks/santander.png', // Santander
  '104': '/assets/banks/caixa.png', // Caixa Econômica Federal
  '237': '/assets/banks/bradesco.png', // Bradesco
  '341': '/assets/banks/itau.png', // Itaú
  '260': '/assets/banks/nubank.png', // Nubank
  '077': '/assets/banks/inter.png', // Inter
  '290': '/assets/banks/pagseguro.png', // PagSeguro
  '336': '/assets/banks/c6.png', // C6 Bank
  '422': '/assets/banks/safra.jpg', // Banco Safra (arquivo é .jpg)
  '748': '/assets/banks/sicred.png', // Sicredi (arquivo é sicred.png)
  '102': '/assets/banks/xp.png', // XP Investimentos
};

// Função helper para obter o logo com fallback para emoji
export const getBankLogo = (bankCode: string): string => {
  const logo = bankLogos[bankCode];
  // Se o logo começa com /, assume que é um caminho de imagem
  // Caso contrário, retorna o emoji
  return logo || '🏦';
};

export const bankNames: Record<string, string> = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '104': 'Caixa Econômica Federal',
  '237': 'Bradesco',
  '341': 'Itaú',
  '260': 'Nubank',
  '077': 'Inter',
  '290': 'PagSeguro',
  '336': 'C6 Bank',
  '422': 'Banco Safra',
  '748': 'Sicredi',
  '102': 'XP Investimentos',
};

export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'Nubank',
    bankCode: '260',
    accountType: 'checking',
    accountNumber: '****1234',
    agency: '0001',
    holderName: 'João Silva',
    isConnected: true,
    lastSync: '2025-01-15T10:30:00',
    balance: 2802.94,
    logo: bankLogos['260'], // Usa o logo do banco
  },
  {
    id: '2',
    bankName: 'Inter',
    bankCode: '077',
    accountType: 'checking',
    accountNumber: '****5678',
    agency: '0001',
    holderName: 'João Silva',
    isConnected: true,
    lastSync: '2025-01-15T09:15:00',
    balance: 1500.00,
    logo: bankLogos['077'], // Usa o logo do banco
  },
  {
    id: '3',
    bankName: 'Itaú',
    bankCode: '341',
    accountType: 'savings',
    accountNumber: '****9012',
    agency: '1234',
    holderName: 'João Silva',
    isConnected: false,
    logo: bankLogos['341'], // Usa o logo do banco
  },
];

