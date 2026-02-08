import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { gamificationData, elos } from '../mocks/gamification';
import EloRoadmap from '../components/Profile/EloRoadmap';
import AvatarShrine from '../components/Profile/AvatarShrine';

export default function Profile() {
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
            Perfil e Evolução
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sua jornada de maestria financeira
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <User className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Altar do Avatar */}
      <AvatarShrine
        currentElo={gamificationData.currentElo}
        eloProgress={gamificationData.eloProgress}
      />

      {/* Roadmap de Elos */}
      <EloRoadmap
        elos={elos.map(elo => ({
          name: elo.name,
          focus: elo.focus,
          icon: elo.icon,
        }))}
        currentElo={gamificationData.currentElo}
        progress={gamificationData.eloProgress}
      />
    </div>
  );
}

