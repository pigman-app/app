import { motion } from 'framer-motion';
import { Repeat, Plus, TrendingUp, TrendingDown, CreditCard, DollarSign, FileText, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

type RecurrenceType = 'income' | 'fixed' | 'credit-card' | 'loan';
type TabType = 'all' | 'income' | 'expenses';
type ExpenseSubTab = 'fixed' | 'credit-card' | 'loan';
type PaymentStatus = 'pending' | 'paid';

interface Recurrence {
  id: string;
  type: RecurrenceType;
  title: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDue: string;
  category?: string;
  cardName?: string;
  installments?: number;
  totalInstallments?: number;
  paymentStatus?: PaymentStatus;
  paidDate?: string;
}

export default function Recurrences() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [expenseSubTab, setExpenseSubTab] = useState<ExpenseSubTab | null>(null);
  const [paymentFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [showForm, setShowForm] = useState(false);
  const [, setSelectedType] = useState<RecurrenceType | null>(null);
  const [chartPage, setChartPage] = useState(0); // 0 = meses 1-6, 1 = meses 7-12

  // Carregar dados do localStorage
  const loadRecurrences = (): Recurrence[] => {
    try {
      const saved = localStorage.getItem('pigman_recurrences');
      if (saved) {
        const data = JSON.parse(saved);
        return data.recurrences || [];
      }
    } catch {
      // Fallback para dados mock
    }
    
    // Mock data padrão
    return [
      {
        id: '1',
        type: 'income',
        title: 'Salário',
        amount: 5000.00,
        frequency: 'monthly',
        nextDue: '05/01/2025',
        paymentStatus: 'pending' as PaymentStatus,
      },
      {
        id: '2',
        type: 'fixed',
        title: 'Aluguel',
        amount: 1500.00,
        frequency: 'monthly',
        nextDue: '10/01/2025',
        category: 'Moradia',
        paymentStatus: 'pending' as PaymentStatus,
      },
      {
        id: '3',
        type: 'credit-card',
        title: 'Fatura Cartão Nubank',
        amount: 1200.00,
        frequency: 'monthly',
        nextDue: '15/01/2025',
        cardName: 'Nubank',
        paymentStatus: 'paid' as PaymentStatus,
        paidDate: '10/01/2025',
      },
      {
        id: '4',
        type: 'loan',
        title: 'Financiamento Imóvel',
        amount: 2500.00,
        frequency: 'monthly',
        nextDue: '20/01/2025',
        installments: 12,
        totalInstallments: 120,
        paymentStatus: 'pending' as PaymentStatus,
      },
    ];
  };

  const [recurrences, setRecurrences] = useState<Recurrence[]>(loadRecurrences());

  // Salvar no localStorage
  const saveRecurrences = (updatedRecurrences: Recurrence[]) => {
    localStorage.setItem('pigman_recurrences', JSON.stringify({
      recurrences: updatedRecurrences,
    }));
  };

  const togglePaymentStatus = (id: string) => {
    const updated = recurrences.map(rec => {
      if (rec.id === id) {
        const newStatus: PaymentStatus = rec.paymentStatus === 'paid' ? 'pending' : 'paid';
        return {
          ...rec,
          paymentStatus: newStatus,
          paidDate: newStatus === 'paid' ? new Date().toLocaleDateString('pt-BR') : undefined,
        };
      }
      return rec;
    });
    setRecurrences(updated);
    saveRecurrences(updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      monthly: 'Mensal',
      weekly: 'Semanal',
      yearly: 'Anual',
    };
    return labels[frequency] || frequency;
  };

  const getTypeIcon = (type: RecurrenceType) => {
    switch (type) {
      case 'income':
        return TrendingUp;
      case 'fixed':
        return DollarSign;
      case 'credit-card':
        return CreditCard;
      case 'loan':
        return FileText;
      default:
        return Repeat;
    }
  };

  const getTypeColor = (type: RecurrenceType) => {
    switch (type) {
      case 'income':
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'fixed':
        return 'bg-brand-pink/10 text-brand-pink border-brand-pink/20';
      case 'credit-card':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'loan':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredRecurrences = recurrences.filter((rec) => {
    // Filtro por tipo
    let typeMatch = true;
    if (activeTab === 'income') typeMatch = rec.type === 'income';
    if (activeTab === 'expenses') {
      if (expenseSubTab === null) typeMatch = rec.type !== 'income';
      else typeMatch = rec.type === expenseSubTab;
    }

    // Filtro por status de pagamento
    let paymentMatch = true;
    if (paymentFilter === 'pending') paymentMatch = (rec.paymentStatus || 'pending') === 'pending';
    if (paymentFilter === 'paid') paymentMatch = rec.paymentStatus === 'paid';

    return typeMatch && paymentMatch;
  });

  const incomeTotal = recurrences
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const expensesTotal = recurrences
    .filter((r) => r.type !== 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  // Gerar dados dos próximos 12 meses
  const generateMonthlyData = () => {
    const months = [];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const fullDate = `${monthName}/${date.getFullYear()}`;
      
      // Calcular valores baseado nas recorrências
      let income = 0;
      let fixed = 0;
      let creditCard = 0;
      let loan = 0;
      
      recurrences.forEach((rec) => {
        if (rec.frequency === 'monthly') {
          // Mensal aparece em todos os meses
          if (rec.type === 'income') income += rec.amount;
          if (rec.type === 'fixed') fixed += rec.amount;
          if (rec.type === 'credit-card') creditCard += rec.amount;
          if (rec.type === 'loan') loan += rec.amount;
        } else if (rec.frequency === 'yearly') {
          // Anual aparece apenas uma vez por ano (no mês correspondente)
          const recDate = new Date(rec.nextDue.split('/').reverse().join('-'));
          if (date.getMonth() === recDate.getMonth() && i < 12) {
            if (rec.type === 'income') income += rec.amount;
            if (rec.type === 'fixed') fixed += rec.amount;
            if (rec.type === 'credit-card') creditCard += rec.amount;
            if (rec.type === 'loan') loan += rec.amount;
          }
        } else if (rec.frequency === 'weekly') {
          // Semanal: aproximadamente 4.33 vezes por mês
          if (rec.type === 'income') income += rec.amount * 4.33;
          if (rec.type === 'fixed') fixed += rec.amount * 4.33;
          if (rec.type === 'credit-card') creditCard += rec.amount * 4.33;
          if (rec.type === 'loan') loan += rec.amount * 4.33;
        }
      });
      
      months.push({
        month: monthName,
        fullDate: fullDate,
        Receitas: Math.round(income),
        'Gastos Fixos': Math.round(fixed),
        'Cartões': Math.round(creditCard),
        'Empréstimos': Math.round(loan),
        Total: Math.round(income + fixed + creditCard + loan),
      });
    }
    
    return months;
  };

  const chartData = useMemo(() => generateMonthlyData(), [recurrences]);

  // Dados do gráfico baseado no filtro ativo e página atual
  const getChartData = () => {
    const startIndex = chartPage * 6;
    const endIndex = startIndex + 6;
    const pageData = chartData.slice(startIndex, endIndex);
    
    if (activeTab === 'all') {
      return pageData.map((d) => ({
        month: d.month,
        fullDate: d.fullDate,
        Receitas: d.Receitas,
        Gastos: d['Gastos Fixos'] + d.Cartões + d.Empréstimos,
      }));
    }
    
    if (activeTab === 'income') {
      return pageData.map((d) => ({
        month: d.month,
        fullDate: d.fullDate,
        Receitas: d.Receitas,
      }));
    }
    
    if (activeTab === 'expenses') {
      if (expenseSubTab === null) {
        return pageData.map((d) => ({
          month: d.month,
          fullDate: d.fullDate,
          'Gastos Fixos': d['Gastos Fixos'],
          Cartões: d.Cartões,
          Empréstimos: d.Empréstimos,
        }));
      }
      
      if (expenseSubTab === 'fixed') {
        return pageData.map((d) => ({
          month: d.month,
          fullDate: d.fullDate,
          'Gastos Fixos': d['Gastos Fixos'],
        }));
      }
      
      if (expenseSubTab === 'credit-card') {
        return pageData.map((d) => ({
          month: d.month,
          fullDate: d.fullDate,
          Cartões: d.Cartões,
        }));
      }
      
      if (expenseSubTab === 'loan') {
        return pageData.map((d) => ({
          month: d.month,
          fullDate: d.fullDate,
          Empréstimos: d.Empréstimos,
        }));
      }
    }
    
    return pageData;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-card shadow-soft border border-gray-200 dark:border-gray-700">
          {data?.fullDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
              {data.fullDate}
            </p>
          )}
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartTitle = () => {
    const startMonth = chartData[chartPage * 6]?.fullDate || '';
    const endMonth = chartData[Math.min(chartPage * 6 + 5, 11)]?.fullDate || '';
    
    if (activeTab === 'all') return `Visão Geral - Próximos 6 Meses (${startMonth} a ${endMonth})`;
    if (activeTab === 'income') return `Receitas - Próximos 6 Meses (${startMonth} a ${endMonth})`;
    if (activeTab === 'expenses') {
      if (expenseSubTab === null) return `Gastos - Próximos 6 Meses (${startMonth} a ${endMonth})`;
      if (expenseSubTab === 'fixed') return `Gastos Fixos - Próximos 6 Meses (${startMonth} a ${endMonth})`;
      if (expenseSubTab === 'credit-card') return `Cartões - Próximos 6 Meses (${startMonth} a ${endMonth})`;
      if (expenseSubTab === 'loan') return `Empréstimos - Próximos 6 Meses (${startMonth} a ${endMonth})`;
    }
    return `Recorrências - Próximos 6 Meses (${startMonth} a ${endMonth})`;
  };

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
            Recorrências
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Controle suas receitas e gastos recorrentes
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Repeat className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 dark:from-brand-green/20 dark:to-brand-green/10 rounded-card-lg p-4 border border-brand-green/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-brand-green" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Receitas</span>
          </div>
          <p className="text-xl font-bold text-brand-green">
            {formatCurrency(incomeTotal)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 dark:from-brand-pink/20 dark:to-brand-pink/10 rounded-card-lg p-4 border border-brand-pink/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-brand-pink" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Gastos</span>
          </div>
          <p className="text-xl font-bold text-brand-pink">
            {formatCurrency(expensesTotal)}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex gap-2">
          {(['all', 'income', 'expenses'] as TabType[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setChartPage(0); // Resetar para primeira página ao mudar filtro
                if (tab !== 'expenses') {
                  setExpenseSubTab(null);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-brand-pink text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'all' ? 'Todas' : tab === 'income' ? 'Receitas' : 'Gastos'}
            </motion.button>
          ))}
        </div>

        {/* Submenus de Gastos */}
        {activeTab === 'expenses' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 pl-2"
          >
            {([
              { id: 'fixed', label: 'Fixas', icon: DollarSign },
              { id: 'credit-card', label: 'Cartões', icon: CreditCard },
              { id: 'loan', label: 'Empréstimos', icon: FileText },
            ] as { id: ExpenseSubTab; label: string; icon: typeof DollarSign }[]).map((subTab) => {
              const SubIcon = subTab.icon;
              const isActive = expenseSubTab === subTab.id;
              
              return (
                <motion.button
                  key={subTab.id}
                  onClick={() => {
                    setExpenseSubTab(isActive ? null : subTab.id);
                    setChartPage(0); // Resetar para primeira página ao mudar subfiltro
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-pink/20 text-brand-pink border border-brand-pink/30'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  {subTab.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {getChartTitle()}
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                className="text-xs"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
                  return `R$ ${value}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              {activeTab === 'all' && (
                <>
                  <Bar dataKey="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Gastos" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </>
              )}
              {activeTab === 'income' && (
                <Bar dataKey="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} />
              )}
              {activeTab === 'expenses' && expenseSubTab === null && (
                <>
                  <Bar dataKey="Gastos Fixos" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Cartões" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Empréstimos" fill="#F97316" radius={[4, 4, 0, 0]} />
                </>
              )}
              {activeTab === 'expenses' && expenseSubTab === 'fixed' && (
                <Bar dataKey="Gastos Fixos" fill="#EC4899" radius={[4, 4, 0, 0]} />
              )}
              {activeTab === 'expenses' && expenseSubTab === 'credit-card' && (
                <Bar dataKey="Cartões" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              )}
              {activeTab === 'expenses' && expenseSubTab === 'loan' && (
                <Bar dataKey="Empréstimos" fill="#F97316" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Paginação */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartPage(0)}
            disabled={chartPage === 0}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              chartPage === 0
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand-pink text-white hover:bg-pink-600'
            }`}
          >
            <ChevronLeft className="w-3 h-3" />
            Primeiros 6 meses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartPage(1)}
            disabled={chartPage === 1}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              chartPage === 1
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand-pink text-white hover:bg-pink-600'
            }`}
          >
            Próximos 6 meses
            <ChevronRight className="w-3 h-3" />
          </motion.button>
        </div>
      </motion.div>

      {/* Lista de Recorrências */}
      <div className="space-y-3">
        {filteredRecurrences.map((recurrence, index) => {
          const Icon = getTypeIcon(recurrence.type);
          const isPaid = recurrence.paymentStatus === 'paid';
          
          return (
            <motion.div
              key={recurrence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-card-lg p-4 shadow-soft border-2 ${
                isPaid 
                  ? 'border-brand-green/30 bg-brand-green/5' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className={`w-12 h-12 rounded-card flex items-center justify-center ${getTypeColor(recurrence.type)} ${
                  isPaid ? 'opacity-60' : ''
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold mb-1 ${
                          isPaid 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {recurrence.title}
                        </h3>
                        {isPaid && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green text-xs font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Paga
                          </span>
                        )}
                        {!isPaid && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendente
                          </span>
                        )}
                      </div>
                      {recurrence.category && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {recurrence.category}
                        </p>
                      )}
                      {recurrence.cardName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cartão: {recurrence.cardName}
                        </p>
                      )}
                      {recurrence.installments && recurrence.totalInstallments && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Parcela {recurrence.installments}/{recurrence.totalInstallments}
                        </p>
                      )}
                      {isPaid && recurrence.paidDate && (
                        <p className="text-xs text-brand-green mt-1 font-medium">
                          Paga em: {recurrence.paidDate}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        isPaid 
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : recurrence.type === 'income' 
                            ? 'text-brand-green' 
                            : 'text-brand-pink'
                      }`}>
                        {recurrence.type === 'income' ? '+' : '-'}{formatCurrency(recurrence.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getFrequencyLabel(recurrence.frequency)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Próximo: {recurrence.nextDue}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePaymentStatus(recurrence.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isPaid
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20'
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Marcar Pendente
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Marcar como Paga
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botão Adicionar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full bg-brand-pink text-white font-semibold py-4 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Recorrência
        </motion.button>
      </motion.div>

      {/* Modal de Adicionar (simplificado - pode ser expandido depois) */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Nova Recorrência
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedType('income');
                  setShowForm(false);
                  // Aqui você implementaria o formulário de receita
                }}
                className="w-full p-4 rounded-card border-2 border-brand-green/20 hover:border-brand-green bg-brand-green/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-brand-green" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Receita Recorrente</p>
                    <p className="text-xs text-gray-500">Salário, aluguel recebido, etc.</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('fixed');
                  setShowForm(false);
                  // Aqui você implementaria o formulário de gasto fixo
                }}
                className="w-full p-4 rounded-card border-2 border-brand-pink/20 hover:border-brand-pink bg-brand-pink/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-brand-pink" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Gasto Fixo</p>
                    <p className="text-xs text-gray-500">Aluguel, conta de luz, etc.</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('credit-card');
                  setShowForm(false);
                  // Aqui você implementaria o formulário de cartão
                }}
                className="w-full p-4 rounded-card border-2 border-blue-500/20 hover:border-blue-500 bg-blue-500/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Cartão de Crédito</p>
                    <p className="text-xs text-gray-500">Fatura recorrente de cartão</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedType('loan');
                  setShowForm(false);
                  // Aqui você implementaria o formulário de empréstimo
                }}
                className="w-full p-4 rounded-card border-2 border-orange-500/20 hover:border-orange-500 bg-orange-500/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Empréstimo</p>
                    <p className="text-xs text-gray-500">Financiamento, empréstimo pessoal</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancelar
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

