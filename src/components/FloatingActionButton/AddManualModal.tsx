import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, Repeat } from 'lucide-react';

interface AddManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = 'income' | 'expense';
type FrequencyType = 'one-time' | 'recurring';

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Serviços',
  'Outros',
];

export default function AddManualModal({ isOpen, onClose }: AddManualModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('one-time');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  const handleSave = () => {
    if (!description || !amount || !category) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      type: transactionType,
      frequency: frequencyType,
      description,
      amount: parseFloat(amount.replace(',', '.')),
      category,
      date,
      source: 'manual' as const,
      ...(frequencyType === 'recurring' && {
        recurrenceFrequency,
        recurrenceEndDate: recurrenceEndDate || undefined,
      }),
    };

    // Salvar no localStorage
    try {
      const saved = localStorage.getItem('pigman_transactions');
      const transactions = saved ? JSON.parse(saved) : [];
      transactions.push(transaction);
      localStorage.setItem('pigman_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
    
    // Limpar formulário
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setRecurrenceEndDate('');
    
    onClose();
  };

  const handleClose = () => {
    // Reset form ao fechar
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setRecurrenceEndDate('');
    setFrequencyType('one-time');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
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
                Adicionar Transação
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Tipo: Receita ou Despesa */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTransactionType('income')}
                  className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                    transactionType === 'income'
                      ? 'border-brand-green bg-brand-green/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 ${
                    transactionType === 'income' ? 'text-brand-green' : 'text-gray-400'
                  }`} />
                  <span className={`font-semibold ${
                    transactionType === 'income' ? 'text-brand-green' : 'text-gray-400'
                  }`}>
                    Receita
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTransactionType('expense')}
                  className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                    transactionType === 'expense'
                      ? 'border-brand-pink bg-brand-pink/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <TrendingDown className={`w-5 h-5 ${
                    transactionType === 'expense' ? 'text-brand-pink' : 'text-gray-400'
                  }`} />
                  <span className={`font-semibold ${
                    transactionType === 'expense' ? 'text-brand-pink' : 'text-gray-400'
                  }`}>
                    Despesa
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Frequência: Pontual ou Recorrente */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequência *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFrequencyType('one-time')}
                  className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                    frequencyType === 'one-time'
                      ? transactionType === 'income'
                        ? 'border-brand-green bg-brand-green/10'
                        : 'border-brand-pink bg-brand-pink/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Calendar className={`w-5 h-5 ${
                    frequencyType === 'one-time'
                      ? transactionType === 'income' ? 'text-brand-green' : 'text-brand-pink'
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-xs font-semibold ${
                    frequencyType === 'one-time'
                      ? transactionType === 'income' ? 'text-brand-green' : 'text-brand-pink'
                      : 'text-gray-400'
                  }`}>
                    Pontual
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFrequencyType('recurring')}
                  className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                    frequencyType === 'recurring'
                      ? transactionType === 'income'
                        ? 'border-brand-green bg-brand-green/10'
                        : 'border-brand-pink bg-brand-pink/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Repeat className={`w-5 h-5 ${
                    frequencyType === 'recurring'
                      ? transactionType === 'income' ? 'text-brand-green' : 'text-brand-pink'
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-xs font-semibold ${
                    frequencyType === 'recurring'
                      ? transactionType === 'income' ? 'text-brand-green' : 'text-brand-pink'
                      : 'text-gray-400'
                  }`}>
                    Recorrente
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Ex: Supermercado Extra"
              />
            </div>

            {/* Valor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor (R$) *
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d,.-]/g, ''))}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            {/* Categoria */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-card border-2 text-xs font-medium ${
                      category === cat
                        ? transactionType === 'income'
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Data */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            {/* Campos específicos para Recorrente */}
            {frequencyType === 'recurring' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequência da Recorrência *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((freq) => {
                      const labels = {
                        daily: 'Diária',
                        weekly: 'Semanal',
                        monthly: 'Mensal',
                        yearly: 'Anual',
                      };
                      return (
                        <motion.button
                          key={freq}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setRecurrenceFrequency(freq)}
                          className={`p-2 rounded-card border-2 text-xs font-medium ${
                            recurrenceFrequency === freq
                              ? transactionType === 'income'
                                ? 'border-brand-green bg-brand-green/10 text-brand-green'
                                : 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {labels[freq]}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Final (Opcional)
                  </label>
                  <input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    placeholder="Deixe em branco para recorrência infinita"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Deixe em branco para recorrência infinita
                  </p>
                </div>
              </>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-card bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`flex-1 px-4 py-3 rounded-card text-white font-semibold shadow-soft-shadow transition-colors ${
                  transactionType === 'income'
                    ? 'bg-brand-green hover:bg-green-600'
                    : 'bg-brand-pink hover:bg-pink-600'
                }`}
              >
                Adicionar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

