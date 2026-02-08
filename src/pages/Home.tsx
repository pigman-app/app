import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';
import { dashboardData } from '../mocks/userDashboard';
import { creditCardsData } from '../mocks/finances';
import Header from '../components/Dashboard/Header';
import StreakCard from '../components/Dashboard/StreakCard';
import BalanceScenarioCard from '../components/Dashboard/BalanceScenarioCard';
import SmartBudgets from '../components/Dashboard/SmartBudgets';
import PendingExpensesCard from '../components/Dashboard/PendingExpensesCard';
import ExpensesDonutChart from '../components/Dashboard/ExpensesDonutChart';
import DreamsMap from '../components/Dreams/DreamsMap';

interface HomeProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { balance, real, predicted, pigMan, pendingExpenses, expensesByCategory } = dashboardData;
  
  const totalCardsLimit = creditCardsData.reduce((sum, card) => sum + card.limit, 0);
  const totalCardsUsed = creditCardsData.reduce((sum, card) => sum + card.used, 0);

  const handleViewDreams = () => {
    onNavigate?.('dreams');
  };

  const handleAddDream = () => {
    // Navegar para estratégia ou criar modal
    onNavigate?.('strategy');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header com Avatar Pig-Man e Ofensiva */}
      <Header
        userName="João Silva"
        elo={pigMan.elo}
        xp={pigMan.xp}
        xpToNext={pigMan.xpToNext}
        streak={pigMan.streak}
      />

      {/* 2. Streak Card (grande e destacado) - NOVO */}
      <StreakCard streak={pigMan.streak} />

      {/* 3. Saldo, Receitas e Despesas com Toggle de Cenário */}
      <BalanceScenarioCard
        real={real}
        predicted={predicted}
      />

      {/* 4. Smart Budgets (alertas por cores) - NOVO */}
      <SmartBudgets />

      {/* 5. Despesas Pendentes */}
      <PendingExpensesCard
        count={pendingExpenses.count}
        total={pendingExpenses.total}
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

