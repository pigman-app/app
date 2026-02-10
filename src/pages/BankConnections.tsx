import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, Plus, Trash2, RefreshCw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { BankAccount, mockBankAccounts, bankNames, bankLogos } from '../mocks/bankConnections';
import BankConnectionModal from '../components/BankConnections/BankConnectionModal';

export default function BankConnections() {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem('pigman_bank_connections');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback para dados mock
    }
    return mockBankAccounts;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [showBalances, setShowBalances] = useState(true);

  useEffect(() => {
    localStorage.setItem('pigman_bank_connections', JSON.stringify(accounts));
  }, [accounts]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      checking: 'Conta Corrente',
      savings: 'Conta Poupança',
      investment: 'Conta Investimento',
    };
    return labels[type] || type;
  };

  const handleSave = (account: BankAccount) => {
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === account.id ? account : a));
    } else {
      setAccounts(prev => [...prev, { ...account, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setEditingAccount(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja desconectar esta conta?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleToggleConnection = (id: string) => {
    setAccounts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          isConnected: !a.isConnected,
          lastSync: a.isConnected ? undefined : new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  const handleSync = (id: string) => {
    setAccounts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          lastSync: new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  const connectedAccounts = accounts.filter(a => a.isConnected);
  const disconnectedAccounts = accounts.filter(a => !a.isConnected);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Conexões Bancárias
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie suas contas conectadas
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Link className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contas Conectadas</p>
            <p className="text-2xl font-bold text-brand-green">
              {connectedAccounts.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo Total</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-brand-green">
                {showBalances 
                  ? formatCurrency(connectedAccounts.reduce((sum, a) => sum + (a.balance || 0), 0))
                  : 'R$ ••••,••'
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBalances(!showBalances)}
                className="text-gray-500 dark:text-gray-400"
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botão Adicionar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingAccount(null);
            setShowModal(true);
          }}
          className="w-full bg-brand-pink text-white font-semibold py-4 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Conectar Nova Conta
        </motion.button>
      </motion.div>

      {/* Contas Conectadas */}
      {connectedAccounts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contas Conectadas
          </h2>
          <div className="space-y-3">
            {connectedAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  {/* Logo do Banco */}
                  <div className="w-12 h-12 rounded-card bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                    {(() => {
                      const logoPath = bankLogos[account.bankCode] || account.logo || '🏦';
                      if (logoPath.startsWith('/')) {
                        return (
                          <img 
                            src={logoPath} 
                            alt={account.bankName}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              // Fallback para emoji se a imagem não carregar
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<span class="text-2xl">🏦</span>';
                              }
                            }}
                          />
                        );
                      }
                      return <span className="text-2xl">{logoPath}</span>;
                    })()}
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {account.bankName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getAccountTypeLabel(account.accountType)} • Ag. {account.agency} • Conta {account.accountNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {account.holderName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Conectada
                      </div>
                    </div>

                    {/* Saldo */}
                    {account.balance !== undefined && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Saldo</p>
                        <p className="text-lg font-bold text-brand-green">
                          {showBalances ? formatCurrency(account.balance) : 'R$ ••••,••'}
                        </p>
                      </div>
                    )}

                    {/* Última Sincronização */}
                    {account.lastSync && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Última sincronização: {formatDate(account.lastSync)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSync(account.id)}
                    className="flex-1 px-3 py-2 rounded-card bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sincronizar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingAccount(account);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 rounded-card bg-brand-pink/10 text-brand-pink text-sm font-semibold hover:bg-brand-pink/20 transition-colors"
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleConnection(account.id)}
                    className="px-3 py-2 rounded-card bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(account.id)}
                    className="px-3 py-2 rounded-card bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Contas Desconectadas */}
      {disconnectedAccounts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contas Desconectadas
          </h2>
          <div className="space-y-3">
            {disconnectedAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-card bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 opacity-60">
                    {(() => {
                      const logoPath = bankLogos[account.bankCode] || account.logo || '🏦';
                      if (logoPath.startsWith('/')) {
                        return (
                          <img 
                            src={logoPath} 
                            alt={account.bankName}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<span class="text-2xl">🏦</span>';
                              }
                            }}
                          />
                        );
                      }
                      return <span className="text-2xl">{logoPath}</span>;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {account.bankName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getAccountTypeLabel(account.accountType)} • Ag. {account.agency} • Conta {account.accountNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                        <XCircle className="w-3 h-3" />
                        Desconectada
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleConnection(account.id)}
                    className="flex-1 px-3 py-2 rounded-card bg-brand-green text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    Reconectar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(account.id)}
                    className="px-3 py-2 rounded-card bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <BankConnectionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAccount(null);
        }}
        onSave={handleSave}
        account={editingAccount || undefined}
      />
    </div>
  );
}

