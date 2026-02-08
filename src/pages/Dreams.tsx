import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import DreamsMap from '../components/Dreams/DreamsMap';

interface DreamsProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams') => void;
}

export default function Dreams({ onNavigate }: DreamsProps) {
  const handleAddDream = () => {
    // Navegar para estratégia para criar sonho via simulador
    onNavigate?.('strategy');
  };

  const handleViewTrail = (dreamId: string) => {
    // Aqui poderia abrir modal ou navegar para detalhes
    console.log('Ver trilha do sonho:', dreamId);
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
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate?.('home')}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mapa de Sonhos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Suas metas financeiras em trilhas gamificadas
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Mapa de Sonhos Completo */}
      <DreamsMap 
        onAddDream={handleAddDream}
        onViewTrail={handleViewTrail}
        showAddButton={true}
      />
    </div>
  );
}





