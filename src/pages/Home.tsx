import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';
import { dashboardData } from '../mocks/userDashboard';
import { creditCardsData } from '../mocks/finances';
import Header from '../components/Dashboard/Header';
import BalanceScenarioCard from '../components/Dashboard/BalanceScenarioCard';
import SmartBudgets from '../components/Dashboard/SmartBudgets';
import PendingExpensesCard from '../components/Dashboard/PendingExpensesCard';
import ExpensesDonutChart from '../components/Dashboard/ExpensesDonutChart';
import DreamsMap from '../components/Dreams/DreamsMap';

interface HomeProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'budgets' | 'recurrences') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { real, predicted, pigMan, expensesByCategory } = dashboardData;
  
  const totalCardsLimit = creditCardsData.reduce((sum, card) => sum + card.limit, 0);
  const totalCardsUsed = creditCardsData.reduce((sum, card) => sum + card.used, 0);

  // Calcular dados de recorrências do localStorage
  const getRecurrencesData = () => {
    try {
      const saved = localStorage.getItem('pigman_recurrences');
      if (saved) {
        const data = JSON.parse(saved);
        const recurrences = data.recurrences || [];
        
        // Calcular total mensal considerando todas as frequências
        const monthlyTotal = recurrences
          .filter((r: any) => r.frequency === 'monthly')
          .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
        
        const weeklyTotal = recurrences
          .filter((r: any) => r.frequency === 'weekly')
          .reduce((sum: number, r: any) => sum + (r.amount || 0), 0) * 4.33; // Aproximação mensal
        
        const yearlyTotal = recurrences
          .filter((r: any) => r.frequency === 'yearly')
          .reduce((sum: number, r: any) => sum + (r.amount || 0), 0) / 12; // Aproximação mensal
        
        return {
          count: recurrences.length,
          total: monthlyTotal + weeklyTotal + yearlyTotal,
        };
      }
    } catch {
      // Fallback para dados mock
    }
    
    // Dados mock padrão (baseado nas recorrências da página)
    return {
      count: 4,
      total: 10200.00, // Salário (5000) + Aluguel (1500) + Cartão (1200) + Financiamento (2500)
    };
  };

  const recurrencesData = getRecurrencesData();

  const handleViewDreams = () => {
    onNavigate?.('dreams');
  };

  const handleAddDream = () => {
    // Navegar para estratégia ou criar modal
    onNavigate?.('strategy');
  };

  return (
    <div className="space-y-4">
      {/* 1. Header com Avatar Pig-Man e Ofensiva */}
      <Header
        userName="João Silva"
        elo={pigMan.elo}
        xp={pigMan.xp}
        xpToNext={pigMan.xpToNext}
        streak={pigMan.streak}
      />

      {/* 2. Saldo, Receitas e Despesas com Toggle de Cenário */}
      <BalanceScenarioCard
        real={real}
        predicted={predicted}
      />

      {/* 4. Smart Budgets (alertas por cores) - NOVO */}
      <SmartBudgets onManage={() => onNavigate?.('budgets')} />

      {/* 5. Recorrências */}
      <PendingExpensesCard
        count={recurrencesData.count}
        total={recurrencesData.total}
        onNavigate={() => onNavigate?.('recurrences')}
      />

      {/* 6. Gráfico de Rosca - Despesas por Categoria */}
      <ExpensesDonutChart data={expensesByCategory} />

      {/* 7. Cartões de Crédito */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-brand-pink" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cartões de Crédito
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {creditCardsData.length} cartões
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Limite Total</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
              }).format(totalCardsLimit)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Utilizado</span>
            <span className="text-base font-semibold text-brand-pink">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
              }).format(totalCardsUsed)}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate?.('cards')}
          className="w-full bg-brand-pink text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2 shadow-soft-shadow hover:bg-pink-600 transition-colors"
        >
          Ver Cartões
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* 8. Mapa de Sonhos (prévia com link) - NOVO */}
      <DreamsMap 
        onAddDream={handleAddDream}
        onViewTrail={handleViewDreams}
        showAddButton={true}
        limit={2}
      />
    </div>
  );
}

