import { motion } from 'framer-motion';
import { Target, Trophy } from 'lucide-react';
import { useState } from 'react';
import { gamificationData } from '../mocks/gamification';
import MissionCard from '../components/Profile/MissionCard';

type FilterType = 'all' | 'daily' | 'weekly' | 'monthly' | 'achievement';

export default function Missions() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const handleMissionComplete = (missionId: string) => {
    console.log('Missão completada:', missionId);
    // Aqui você pode adicionar lógica para atualizar XP, etc.
  };

  // Filtrar missões baseado no filtro selecionado
  const getFilteredMissions = () => {
    if (selectedFilter === 'all') {
      return gamificationData.missions;
    }
    return gamificationData.missions.filter(m => m.type === selectedFilter);
  };

  const filteredMissions = getFilteredMissions();
  const dailyMissions = filteredMissions.filter(m => m.type === 'daily');
  const weeklyMissions = filteredMissions.filter(m => m.type === 'weekly');
  const monthlyMissions = filteredMissions.filter(m => m.type === 'monthly');
  const achievementMissions = filteredMissions.filter(m => m.type === 'achievement');

  const completedMissions = gamificationData.missions.filter(m => m.completed);
  const activeMissions = gamificationData.missions.filter(m => !m.completed);

  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'Todas' },
    { type: 'daily', label: 'Diárias' },
    { type: 'weekly', label: 'Semanais' },
    { type: 'monthly', label: 'Mensais' },
    { type: 'achievement', label: 'Conquistas' },
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
            Missões
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete missões para ganhar XP e subir de nível
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-brand-pink/10 to-brand-yellow/10 dark:from-brand-pink/20 dark:to-brand-yellow/20 rounded-card-lg p-4 shadow-soft-shadow"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-pink">
              {activeMissions.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Missões Ativas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-green">
              {completedMissions.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Completadas
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.type}
            onClick={() => setSelectedFilter(filter.type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedFilter === filter.type
                ? 'bg-brand-pink text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Missões Filtradas */}
      {selectedFilter === 'all' || selectedFilter === 'daily' ? (
        dailyMissions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-brand-yellow" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Missões Diárias
              </h2>
            </div>
            <div className="space-y-3">
              {dailyMissions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index}
                  onComplete={handleMissionComplete}
                />
              ))}
            </div>
          </div>
        )
      ) : null}

      {selectedFilter === 'all' || selectedFilter === 'weekly' ? (
        weeklyMissions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-pink/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-brand-pink" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Missões Semanais
              </h2>
            </div>
            <div className="space-y-3">
              {weeklyMissions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index + dailyMissions.length}
                  onComplete={handleMissionComplete}
                />
              ))}
            </div>
          </div>
        )
      ) : null}

      {selectedFilter === 'all' || selectedFilter === 'monthly' ? (
        monthlyMissions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Missões Mensais
              </h2>
            </div>
            <div className="space-y-3">
              {monthlyMissions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index + dailyMissions.length + weeklyMissions.length}
                  onComplete={handleMissionComplete}
                />
              ))}
            </div>
          </div>
        )
      ) : null}

      {selectedFilter === 'all' || selectedFilter === 'achievement' ? (
        achievementMissions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-brand-green" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conquistas
              </h2>
            </div>
            <div className="space-y-3">
              {achievementMissions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index + dailyMissions.length + weeklyMissions.length + monthlyMissions.length}
                  onComplete={handleMissionComplete}
                />
              ))}
            </div>
          </div>
        )
      ) : null}

      {/* Mensagem quando não há missões no filtro */}
      {filteredMissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma missão encontrada
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Não há missões deste tipo no momento
          </p>
        </motion.div>
      )}
    </div>
  );
}

