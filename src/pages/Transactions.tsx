import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileText, Sparkles, Edit, Filter, TrendingUp, TrendingDown, Calendar, DollarSign, Search } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  frequency: 'one-time' | 'recurring';
  description: string;
  amount: number;
  category: string;
  date: string;
  source: 'ai' | 'extract' | 'manual';
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceEndDate?: string;
}

type FilterType = 'all' | 'ai' | 'extract' | 'manual' | 'income' | 'expense' | 'one-time' | 'recurring';
type PeriodFilter = 'all' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

// Dados mockados
const mockTransactions: Transaction[] = [
  // Transações por IA
  { id: '1', type: 'expense', frequency: 'one-time', description: 'Supermercado Extra', amount: 350.50, category: 'Alimentação', date: '2025-01-15', source: 'ai' },
  { id: '2', type: 'income', frequency: 'one-time', description: 'Salário Janeiro', amount: 5000.00, category: 'Serviços', date: '2025-01-05', source: 'ai' },
  { id: '3', type: 'expense', frequency: 'recurring', description: 'Netflix', amount: 45.90, category: 'Lazer', date: '2025-01-10', source: 'ai', recurrenceFrequency: 'monthly' },
  
  // Transações por Extrato
  { id: '4', type: 'expense', frequency: 'one-time', description: 'Fatura Cartão Nubank', amount: 1250.00, category: 'Compras', date: '2025-01-12', source: 'extract' },
  { id: '5', type: 'expense', frequency: 'one-time', description: 'Uber', amount: 28.50, category: 'Transporte', date: '2025-01-14', source: 'extract' },
  { id: '6', type: 'expense', frequency: 'one-time', description: 'Farmácia', amount: 89.90, category: 'Saúde', date: '2025-01-11', source: 'extract' },
  { id: '7', type: 'income', frequency: 'one-time', description: 'Freelance Design', amount: 800.00, category: 'Serviços', date: '2025-01-08', source: 'extract' },
  
  // Transações Manuais
  { id: '8', type: 'expense', frequency: 'recurring', description: 'Aluguel', amount: 1200.00, category: 'Moradia', date: '2025-01-01', source: 'manual', recurrenceFrequency: 'monthly' },
  { id: '9', type: 'expense', frequency: 'one-time', description: 'Academia', amount: 99.90, category: 'Saúde', date: '2025-01-03', source: 'manual' },
  { id: '10', type: 'expense', frequency: 'recurring', description: 'Spotify', amount: 21.90, category: 'Lazer', date: '2025-01-05', source: 'manual', recurrenceFrequency: 'monthly' },
  { id: '11', type: 'income', frequency: 'one-time', description: 'Venda de produto', amount: 250.00, category: 'Compras', date: '2025-01-09', source: 'manual' },
  { id: '12', type: 'expense', frequency: 'one-time', description: 'Restaurante', amount: 120.00, category: 'Alimentação', date: '2025-01-13', source: 'manual' },
  
  // Transações de dezembro (para testar filtros de período)
  { id: '13', type: 'expense', frequency: 'one-time', description: 'Presente de Natal', amount: 150.00, category: 'Compras', date: '2024-12-20', source: 'manual' },
  { id: '14', type: 'income', frequency: 'one-time', description: '13º Salário', amount: 5000.00, category: 'Serviços', date: '2024-12-15', source: 'ai' },
  { id: '15', type: 'expense', frequency: 'one-time', description: 'Decoração Natal', amount: 200.00, category: 'Compras', date: '2024-12-10', source: 'manual' },
  
  // Transações de novembro
  { id: '16', type: 'expense', frequency: 'one-time', description: 'Black Friday', amount: 800.00, category: 'Compras', date: '2024-11-25', source: 'extract' },
  { id: '17', type: 'expense', frequency: 'recurring', description: 'Plano de Celular', amount: 79.90, category: 'Serviços', date: '2024-11-05', source: 'manual', recurrenceFrequency: 'monthly' },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Carregar transações do localStorage ou usar mock
    const saved = localStorage.getItem('pigman_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Combinar com dados mockados se houver transações salvas
        const allTransactions = [...mockTransactions, ...parsed];
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
        setTransactions(mockTransactions);
      }
    } else {
      // Se não houver transações salvas, usar apenas mock
      setTransactions(mockTransactions);
    }
  }, []);

  const getDateRange = (period: PeriodFilter): { start: Date; end: Date } => {
    const now = new Date();
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start = new Date();

    switch (period) {
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
        } else {
          // Se não tiver datas customizadas, retornar todas as datas
          start = new Date(0);
          end = new Date(9999, 11, 31);
        }
        break;
      default:
        start = new Date(0); // Todas as datas
        end = new Date(9999, 11, 31);
    }

    return { start, end };
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro por pesquisa
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesDescription = transaction.description.toLowerCase().includes(query);
      const matchesCategory = transaction.category.toLowerCase().includes(query);
      const matchesAmount = formatCurrency(transaction.amount).toLowerCase().includes(query);
      
      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    // Filtro por tipo/fonte
    if (filter !== 'all') {
      if (filter === 'ai' || filter === 'extract' || filter === 'manual') {
        if (transaction.source !== filter) return false;
      } else if (filter === 'income' || filter === 'expense') {
        if (transaction.type !== filter) return false;
      } else if (filter === 'one-time' || filter === 'recurring') {
        if (transaction.frequency !== filter) return false;
      }
    }

    // Filtro por período
    if (periodFilter !== 'all') {
      const { start, end } = getDateRange(periodFilter);
      const transactionDate = new Date(transaction.date);
      if (transactionDate < start || transactionDate > end) {
        return false;
      }
    }

    return true;
  });

  const getSourceIcon = (source: 'ai' | 'extract' | 'manual') => {
    switch (source) {
      case 'ai':
        return <Sparkles className="w-4 h-4 text-brand-pink" />;
      case 'extract':
        return <FileText className="w-4 h-4 text-brand-green" />;
      case 'manual':
        return <Edit className="w-4 h-4 text-brand-yellow" />;
    }
  };

  const getSourceLabel = (source: 'ai' | 'extract' | 'manual') => {
    switch (source) {
      case 'ai':
        return 'IA';
      case 'extract':
        return 'Extrato';
      case 'manual':
        return 'Manual';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const filterOptions: { value: FilterType; label: string; icon: any }[] = [
    { value: 'all', label: 'Todas', icon: Filter },
    { value: 'ai', label: 'Por IA', icon: Sparkles },
    { value: 'extract', label: 'Por Extrato', icon: FileText },
    { value: 'manual', label: 'Manual', icon: Edit },
    { value: 'income', label: 'Receitas', icon: TrendingUp },
    { value: 'expense', label: 'Despesas', icon: TrendingDown },
    { value: 'one-time', label: 'Pontuais', icon: Calendar },
    { value: 'recurring', label: 'Recorrentes', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transações
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Histórico completo de todas as transações
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Estatísticas - Totais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-brand-green/10 dark:bg-brand-green/20 rounded-card-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total de Receitas</p>
          <p className="text-xl font-bold text-brand-green">
            {formatCurrency(
              filteredTransactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
        <div className="bg-brand-pink/10 dark:bg-brand-pink/20 rounded-card-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total de Despesas</p>
          <p className="text-xl font-bold text-brand-pink">
            {formatCurrency(
              filteredTransactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </motion.div>

      {/* Filtros de Período */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft"
      >
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Período
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'week', label: 'Última Semana' },
              { value: 'month', label: 'Este Mês' },
              { value: 'quarter', label: 'Este Trimestre' },
              { value: 'year', label: 'Este Ano' },
              { value: 'custom', label: 'Personalizado' },
            ].map((period) => (
              <motion.button
                key={period.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPeriodFilter(period.value as PeriodFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-card text-sm font-semibold whitespace-nowrap transition-colors ${
                  periodFilter === period.value
                    ? 'bg-brand-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{period.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filtros Customizados de Data */}
        {periodFilter === 'custom' && (
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Filtros de Tipo/Fonte */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtros
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filter === option.value;
              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-card text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-brand-pink text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Caixa de Pesquisa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar transações por descrição, categoria ou valor..."
            className="w-full pl-10 pr-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Lista de Transações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft"
      >
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-card border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors overflow-hidden"
                >
                  <div className="flex items-start gap-3 w-full">
                    {/* Ícone da fonte */}
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                      {getSourceIcon(transaction.source)}
                    </div>

                    {/* Informações da transação */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                              {getSourceLabel(transaction.source)}
                            </span>
                            {transaction.frequency === 'recurring' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green whitespace-nowrap">
                                Recorrente
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Valor */}
                        <div className="flex flex-col items-end flex-shrink-0 ml-2 max-w-[40%]">
                          <span
                            className={`font-bold text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                              transaction.type === 'income'
                                ? 'text-brand-green'
                                : 'text-brand-pink'
                            }`}
                            title={`${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                          {transaction.frequency === 'recurring' && transaction.recurrenceFrequency && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {transaction.recurrenceFrequency === 'daily' && 'Diária'}
                              {transaction.recurrenceFrequency === 'weekly' && 'Semanal'}
                              {transaction.recurrenceFrequency === 'monthly' && 'Mensal'}
                              {transaction.recurrenceFrequency === 'yearly' && 'Anual'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {formatDate(transaction.date)}
                        </span>
                        <span className="truncate">{transaction.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Nenhuma transação encontrada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {filter === 'all'
                ? 'Comece adicionando sua primeira transação'
                : 'Nenhuma transação corresponde ao filtro selecionado'}
            </p>
          </div>
        )}
      </motion.div>

    </div>
  );
}

