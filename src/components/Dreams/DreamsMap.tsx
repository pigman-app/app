import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { dreamsData } from '../../mocks/dreams';
import DreamCard from './DreamCard';

interface DreamsMapProps {
  onAddDream?: () => void;
  onViewTrail?: (dreamId: string) => void;
  showAddButton?: boolean;
  limit?: number; // Para mostrar apenas alguns no dashboard
}

export default function DreamsMap({ 
  onAddDream, 
  onViewTrail, 
  showAddButton = true,
  limit 
}: DreamsMapProps) {
  const activeDreams = dreamsData.filter(d => d.status === 'active');
  const displayedDreams = limit ? activeDreams.slice(0, limit) : activeDreams;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Mapa de Sonhos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Suas metas financeiras em trilhas gamificadas
          </p>
        </div>
        <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-pink" />
        </div>
      </div>

      {displayedDreams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum sonho criado ainda
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Crie seu primeiro sonho e comece sua jornada!
          </p>
          {showAddButton && onAddDream && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddDream}
              className="bg-brand-pink text-white font-semibold px-6 py-3 rounded-card flex items-center gap-2 mx-auto shadow-soft-shadow hover:bg-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Sonho
            </motion.button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {displayedDreams.map((dream, index) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                index={index}
                onViewTrail={onViewTrail}
              />
            ))}
          </div>

          {showAddButton && onAddDream && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddDream}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-semibold py-4 rounded-card flex items-center justify-center gap-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Sonho
            </motion.button>
          )}

          {limit && activeDreams.length > limit && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {limit} de {activeDreams.length} sonhos ativos
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}




