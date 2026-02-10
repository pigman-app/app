import { motion } from 'framer-motion';
import { Brain, Plus, Edit, Trash2, Check, X, TrendingUp, DollarSign, Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent?: number;
  color: string;
}

export default function Budgets() {
  // Carregar dados do localStorage
  const loadFromStorage = (): { totalIncome: number; budgets: BudgetCategory[] } => {
    const saved = localStorage.getItem('pigman_budgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { totalIncome: 5000.00, budgets: [] };
      }
    }
    return { totalIncome: 5000.00, budgets: [] };
  };

  const savedData = loadFromStorage();
  const [totalIncome, setTotalIncome] = useState(savedData.totalIncome);
  const [showPreviewAI, setShowPreviewAI] = useState(false);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(savedData.budgets);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);

  // Mock de orçamento gerado pela IA
  const aiGeneratedBudget: BudgetCategory[] = [
    { id: '1', name: 'Alimentação', icon: '🍽️', limit: 1000, spent: 640, color: 'green' },
    { id: '2', name: 'Lazer', icon: '🎮', limit: 800, spent: 720, color: 'pink' },
    { id: '3', name: 'Transporte', icon: '🚗', limit: 500, spent: 500, color: 'pink' },
    { id: '4', name: 'Moradia', icon: '🏠', limit: 1500, spent: 1500, color: 'green' },
    { id: '5', name: 'Saúde', icon: '🏥', limit: 400, spent: 200, color: 'green' },
    { id: '6', name: 'Educação', icon: '📚', limit: 300, spent: 0, color: 'green' },
    { id: '7', name: 'Outros', icon: '📦', limit: 500, spent: 240, color: 'yellow' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculateTotalBudget = (budgetList: BudgetCategory[]) => {
    return budgetList.reduce((sum, budget) => sum + budget.limit, 0);
  };

  // Salvar no localStorage
  const saveToStorage = (budgetsToSave: BudgetCategory[], income: number) => {
    localStorage.setItem('pigman_budgets', JSON.stringify({
      totalIncome: income,
      budgets: budgetsToSave,
    }));
  };

  const handleGenerateAI = () => {
    setShowPreviewAI(true);
  };

  const handleAcceptAI = () => {
    const newBudgets = [...aiGeneratedBudget];
    setBudgets(newBudgets);
    setShowPreviewAI(false);
    saveToStorage(newBudgets, totalIncome);
  };

  const handleRejectAI = () => {
    setShowPreviewAI(false);
  };

  const handleAddManual = () => {
    const newBudget: BudgetCategory = {
      id: Date.now().toString(),
      name: '',
      icon: '📦',
      limit: 0,
      color: 'pink',
    };
    setEditingBudget(newBudget);
  };

  const handleSaveBudget = (budget: BudgetCategory) => {
    let updatedBudgets: BudgetCategory[];
    if (budget.id && budgets.find(b => b.id === budget.id)) {
      // Editar existente
      updatedBudgets = budgets.map(b => b.id === budget.id ? budget : b);
    } else {
      // Adicionar novo
      updatedBudgets = [...budgets, { ...budget, id: Date.now().toString() }];
    }
    setBudgets(updatedBudgets);
    setEditingBudget(null);
    saveToStorage(updatedBudgets, totalIncome);
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    saveToStorage(updatedBudgets, totalIncome);
  };

  // Atualizar receita total no storage quando mudar
  const handleIncomeChange = (newIncome: number) => {
    setTotalIncome(newIncome);
    saveToStorage(budgets, newIncome);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger':
        return <XCircle className="w-5 h-5 text-brand-pink" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-brand-yellow" />;
      default:
        return <CheckCircle className="w-5 h-5 text-brand-green" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'danger':
        return 'Limite';
      case 'warning':
        return 'Atenção';
      default:
        return 'Seguro';
    }
  };

  const getBudgetStatusForCategory = (budget: BudgetCategory) => {
    const spent = budget.spent || 0;
    const percentage = (spent / budget.limit) * 100;
    
    if (percentage >= 90) {
      return {
        status: 'danger' as const,
        percentage,
        message: '🔴 Limite atingido!',
      };
    } else if (percentage >= 70) {
      return {
        status: 'warning' as const,
        percentage,
        message: '⚠️ Atenção - 10% restante',
      };
    } else {
      return {
        status: 'safe' as const,
        percentage,
        message: `${Math.round(100 - percentage)}% disponível`,
      };
    }
  };

  const getColorForStatus = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'danger':
        return '#EC4899'; // Rosa/Pink
      case 'warning':
        return '#EAB308'; // Amarelo
      default:
        return '#22C55E'; // Verde
    }
  };

  const totalBudget = calculateTotalBudget(budgets);
  const remaining = totalIncome - totalBudget;

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
            Categorias/Orçamentos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie seus orçamentos por categoria
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Receita Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 dark:from-brand-green/20 dark:to-brand-green/10 rounded-card-lg p-6 border border-brand-green/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-brand-green" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
            <input
              type="number"
              value={totalIncome}
              onChange={(e) => handleIncomeChange(Number(e.target.value))}
              className="text-2xl font-bold text-brand-green bg-transparent border-none outline-none w-full mt-1"
              step="0.01"
            />
          </div>
        </div>
        {totalBudget > 0 && (
          <div className="mt-4 pt-4 border-t border-brand-green/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Orçado</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Disponível</span>
              <span className={`text-lg font-semibold ${
                remaining >= 0 ? 'text-brand-green' : 'text-brand-pink'
              }`}>
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Botões de Ação - Apenas se não houver orçamentos */}
      {budgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateAI}
            className="w-full bg-gradient-to-r from-brand-pink to-pink-600 text-white font-semibold py-4 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:from-pink-600 hover:to-pink-700 transition-all"
          >
            <Brain className="w-5 h-5" />
            Gerar Orçamento Inteligente com IA
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddManual}
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-card flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Criar Manualmente
          </motion.button>
        </motion.div>
      )}

      {/* Visualização do Orçamento da IA (Preview) */}
      {showPreviewAI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-pink" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Orçamento Sugerido pela IA
            </h3>
          </div>
          
          <div className="space-y-4 mb-6">
            {aiGeneratedBudget.map((budget, index) => {
              const status = getBudgetStatusForCategory(budget);
              const color = getColorForStatus(status.status);
              const available = budget.limit - (budget.spent || 0);

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`border-l-4 rounded-card-lg p-4 bg-gray-50 dark:bg-gray-700/50 ${
                    status.status === 'danger'
                      ? 'border-brand-pink'
                      : status.status === 'warning'
                      ? 'border-brand-yellow'
                      : 'border-brand-green'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{budget.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {budget.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(budget.spent || 0)} / {formatCurrency(budget.limit)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.status)}
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          status.status === 'danger'
                            ? 'bg-brand-pink/20 text-brand-pink'
                            : status.status === 'warning'
                            ? 'bg-brand-yellow/20 text-brand-yellow'
                            : 'bg-brand-green/20 text-brand-green'
                        }`}
                      >
                        {getStatusLabel(status.status)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(status.percentage, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {status.percentage >= 90 && (
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </div>

                  {/* Mensagem de Status */}
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-medium ${
                        status.status === 'danger'
                          ? 'text-brand-pink'
                          : status.status === 'warning'
                          ? 'text-brand-yellow'
                          : 'text-brand-green'
                      }`}
                    >
                      {status.message}
                    </p>
                    {status.status === 'safe' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(available)} disponível
                      </p>
                    )}
                  </div>

                  {/* Sugestão da IA quando próximo do limite */}
                  {status.status !== 'safe' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.5 }}
                      className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        💡 <strong>Sugestão da IA:</strong>{' '}
                        {status.status === 'danger'
                          ? 'Considere revisar gastos nesta categoria ou aumentar o limite.'
                          : 'Você está próximo do limite. Monitore seus gastos.'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRejectAI}
              className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-card flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAcceptAI}
              className="flex-1 bg-brand-pink text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
            >
              <Check className="w-5 h-5" />
              Aceitar
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Lista de Orçamentos - Sempre mostra se houver dados */}
      {budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
                {budgets.map((budget, index) => {
                  const status = getBudgetStatusForCategory(budget);
                  const color = getColorForStatus(status.status);
                  const available = budget.limit - (budget.spent || 0);

                  return (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`border-l-4 rounded-card-lg p-4 bg-gray-50 dark:bg-gray-700/50 relative ${
                        status.status === 'danger'
                          ? 'border-brand-pink'
                          : status.status === 'warning'
                          ? 'border-brand-yellow'
                          : 'border-brand-green'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">{budget.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {budget.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatCurrency(budget.spent || 0)} / {formatCurrency(budget.limit)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status.status)}
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              status.status === 'danger'
                                ? 'bg-brand-pink/20 text-brand-pink'
                                : status.status === 'warning'
                                ? 'bg-brand-yellow/20 text-brand-yellow'
                                : 'bg-brand-green/20 text-brand-green'
                            }`}
                          >
                            {getStatusLabel(status.status)}
                          </span>
                          <div className="flex items-center gap-1 ml-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setEditingBudget(budget)}
                              className="p-1.5 rounded-card bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                            >
                              <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteBudget(budget.id)}
                              className="p-1.5 rounded-card bg-white dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Progresso */}
                      <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(status.percentage, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {status.percentage >= 90 && (
                          <motion.div
                            className="absolute inset-0 bg-white/30"
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />
                        )}
                      </div>

                      {/* Mensagem de Status */}
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-medium ${
                            status.status === 'danger'
                              ? 'text-brand-pink'
                              : status.status === 'warning'
                              ? 'text-brand-yellow'
                              : 'text-brand-green'
                          }`}
                        >
                          {status.message}
                        </p>
                        {status.status === 'safe' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCurrency(available)} disponível
                          </p>
                        )}
                      </div>

                      {/* Sugestão da IA quando próximo do limite */}
                      {status.status !== 'safe' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ delay: 0.5 }}
                          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                        >
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            💡 <strong>Sugestão da IA:</strong>{' '}
                            {status.status === 'danger'
                              ? 'Considere revisar gastos nesta categoria ou aumentar o limite.'
                              : 'Você está próximo do limite. Monitore seus gastos.'}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddManual}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-card p-4 text-gray-500 dark:text-gray-400 hover:border-brand-pink hover:text-brand-pink transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Categoria
                </motion.button>
        </motion.div>
      )}

      {/* Botão Gerar Novamente - Ao final da página */}
      {budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateAI}
            className="w-full bg-gradient-to-r from-brand-pink to-pink-600 text-white font-semibold py-4 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:from-pink-600 hover:to-pink-700 transition-all"
          >
            <Brain className="w-5 h-5" />
            Gerar Novo Orçamento com IA
          </motion.button>
        </motion.div>
      )}

      {/* Modal de Edição */}
      {editingBudget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingBudget(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingBudget.id && budgets.find(b => b.id === editingBudget.id) ? 'Editar' : 'Nova'} Categoria
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Nome
                </label>
                <input
                  type="text"
                  value={editingBudget.name}
                  onChange={(e) => setEditingBudget({ ...editingBudget, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  placeholder="Ex: Alimentação"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Limite (R$)
                </label>
                <input
                  type="number"
                  value={editingBudget.limit}
                  onChange={(e) => setEditingBudget({ ...editingBudget, limit: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Cor
                </label>
                <div className="flex gap-2">
                  {['green', 'pink', 'yellow', 'blue'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingBudget({ ...editingBudget, color })}
                      className={`w-12 h-12 rounded-card border-2 ${
                        editingBudget.color === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      } ${getColorClasses(color)}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingBudget(null)}
                className="flex-1 py-2 px-4 rounded-card border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSaveBudget(editingBudget)}
                className="flex-1 py-2 px-4 rounded-card bg-brand-pink text-white hover:bg-pink-600 transition-colors"
              >
                Salvar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

