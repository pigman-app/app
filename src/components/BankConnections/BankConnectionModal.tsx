import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, Building2, CreditCard, TrendingUp, ChevronDown } from 'lucide-react';
import { BankAccount, bankNames, bankLogos } from '../../mocks/bankConnections';

interface BankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: BankAccount) => void;
  account?: BankAccount;
}

const bankCodes = Object.keys(bankNames).map(code => ({
  code,
  name: bankNames[code],
  logo: bankLogos[code] || '🏦',
}));

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: CreditCard },
  { value: 'savings', label: 'Conta Poupança', icon: Building2 },
  { value: 'investment', label: 'Conta Investimento', icon: TrendingUp },
];

export default function BankConnectionModal({
  isOpen,
  onClose,
  onSave,
  account,
}: BankConnectionModalProps) {
  const [bankCode, setBankCode] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'investment'>('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [agency, setAgency] = useState('');
  const [holderName, setHolderName] = useState('');
  const [balance, setBalance] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
        setShowBankDropdown(false);
      }
    };

    if (showBankDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBankDropdown]);

  useEffect(() => {
    if (account) {
      setBankCode(account.bankCode);
      setAccountType(account.accountType);
      setAccountNumber(account.accountNumber.replace('****', ''));
      setAgency(account.agency);
      setHolderName(account.holderName);
      setBalance(account.balance?.toString() || '');
    } else {
      // Reset form
      setBankCode('');
      setAccountType('checking');
      setAccountNumber('');
      setAgency('');
      setHolderName('');
      setBalance('');
    }
  }, [account, isOpen]);

  const handleSave = () => {
    if (!bankCode || !accountNumber || !agency || !holderName) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const bankAccount: BankAccount = {
      id: account?.id || Date.now().toString(),
      bankName: bankNames[bankCode] || 'Banco Desconhecido',
      bankCode,
      accountType,
      accountNumber: `****${accountNumber.slice(-4)}`,
      agency,
      holderName,
      isConnected: true,
      lastSync: new Date().toISOString(),
      balance: balance ? parseFloat(balance.replace(',', '.')) : undefined,
      logo: bankLogos[bankCode] || '🏦', // Usa o logo do banco baseado no código
    };

    onSave(bankAccount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-soft-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {account ? 'Editar Conta' : 'Conectar Nova Conta'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Banco */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banco *
              </label>
              <div className="relative" ref={bankDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowBankDropdown(!showBankDropdown)}
                  className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {bankCode ? (
                      <>
                        {(() => {
                          const logoPath = bankLogos[bankCode] || '🏦';
                          if (logoPath.startsWith('/')) {
                            return (
                              <img 
                                src={logoPath} 
                                alt={bankNames[bankCode]}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            );
                          }
                          return <span className="text-sm">{logoPath}</span>;
                        })()}
                        <span>{bankNames[bankCode]}</span>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Selecione o banco</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showBankDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-card border border-gray-300 dark:border-gray-600 shadow-soft max-h-60 overflow-y-auto"
                    >
                      {bankCodes.map((bank) => {
                        const logoPath = bankLogos[bank.code] || '🏦';
                        return (
                          <motion.button
                            key={bank.code}
                            whileHover={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}
                            onClick={() => {
                              setBankCode(bank.code);
                              setShowBankDropdown(false);
                            }}
                            className={`w-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-brand-pink/10 transition-colors ${
                              bankCode === bank.code ? 'bg-brand-pink/10' : ''
                            }`}
                          >
                            {logoPath.startsWith('/') ? (
                              <img 
                                src={logoPath} 
                                alt={bank.name}
                                className="w-5 h-5 object-contain flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-sm flex-shrink-0">{logoPath}</span>
                            )}
                            <span className="text-sm text-gray-900 dark:text-white">{bank.name}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tipo de Conta */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Conta *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {accountTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAccountType(type.value as any)}
                      className={`p-3 rounded-card border-2 flex flex-col items-center gap-1 ${
                        accountType === type.value
                          ? 'border-brand-pink bg-brand-pink/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${
                        accountType === type.value ? 'text-brand-pink' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        accountType === type.value ? 'text-brand-pink' : 'text-gray-400'
                      }`}>
                        {type.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Agência */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agência *
              </label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="0000"
              />
            </div>

            {/* Número da Conta */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número da Conta *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="12345-6"
              />
            </div>

            {/* Nome do Titular */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Titular *
              </label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="João Silva"
              />
            </div>

            {/* Saldo Inicial (Opcional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Saldo Inicial (Opcional)
              </label>
              <input
                type="text"
                value={balance}
                onChange={(e) => setBalance(e.target.value.replace(/[^\d,.-]/g, ''))}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="0,00"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Informe o saldo atual da conta para começar o monitoramento
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-card bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-card bg-brand-pink text-white font-semibold shadow-soft-shadow hover:bg-pink-600 transition-colors"
              >
                {account ? 'Salvar' : 'Conectar'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

