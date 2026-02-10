import { BankAccount, bankLogos } from '../../mocks/bankConnections';

interface BankLogoProps {
  bankCode: string;
  bankName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BankLogo({ bankCode, bankName, className = '', size = 'md' }: BankLogoProps) {
  const logo = bankLogos[bankCode] || '🏦';
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  // Se for um caminho de imagem (começa com /), renderiza como img
  if (logo.startsWith('/')) {
    return (
      <div className={`${sizeClasses[size]} rounded-card bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden ${className}`}>
        <img 
          src={logo} 
          alt={bankName || 'Banco'}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            // Fallback para emoji se a imagem não carregar
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = '<span class="text-2xl">🏦</span>';
            }
          }}
        />
      </div>
    );
  }

  // Caso contrário, renderiza como emoji/texto
  return (
    <div className={`${sizeClasses[size]} rounded-card bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}>
      <span className="text-2xl">{logo}</span>
    </div>
  );
}

