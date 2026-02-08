import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface HeaderProps {
  userName: string;
  elo: string;
  xp: number;
  xpToNext: number;
  streak: number;
}

export default function Header({ userName, elo, xp, xpToNext, streak }: HeaderProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-6"
    >
      {/* Avatar Pig-Man e Info */}
      <div className="flex items-center gap-3">
        {/* Avatar Pig-Man */}
        <motion.div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center shadow-soft-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🐷</span>
        </motion.div>

        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Olá, {userName.split(' ')[0]}! 👋
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Elo {elo}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-brand-pink">
              {xp}/{xpToNext} XP
            </span>
          </div>
        </div>
      </div>

      {/* Ofensiva (Streak) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col items-end gap-1"
      >
        <div className="flex items-center gap-1 bg-brand-yellow/10 dark:bg-brand-yellow/20 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-brand-yellow" fill="currentColor" />
          <span className="text-sm font-bold text-brand-yellow">{streak}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Ofensiva</span>
      </motion.div>
    </motion.div>
  );
}



