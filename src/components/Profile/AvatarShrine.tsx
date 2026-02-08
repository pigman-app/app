import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Importar as imagens dos avatares
import pigManBronze from '../../assests/pig-man-bronze.png';
import pigManSilver from '../../assests/pig-man-silver.png';
import pigManGold from '../../assests/pig-man-gold.png';
import pigManPlatinium from '../../assests/pig-man-platinium.png';
import pigManMaster from '../../assests/pig-man-master.png';

interface AvatarShrineProps {
  currentElo: string;
  eloProgress: number;
}

// Lista de elos na ordem
const elos = ['Bronze', 'Prata', 'Ouro', 'Platina', 'Mestre'];

// Mapeamento dos avatares por elo
const getAvatarImage = (elo: string): string => {
  const eloLower = elo.toLowerCase();
  const avatarMap: Record<string, string> = {
    bronze: pigManBronze,
    prata: pigManSilver,
    ouro: pigManGold,
    platina: pigManPlatinium,
    mestre: pigManMaster,
  };
  return avatarMap[eloLower] || avatarMap.bronze;
};

export default function AvatarShrine({ currentElo, eloProgress }: AvatarShrineProps) {
  // Sempre começar com Bronze (índice 0)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : elos.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < elos.length - 1 ? prev + 1 : 0));
  };

  const selectedElo = elos[selectedIndex];
  const isCurrentElo = selectedElo.toLowerCase() === currentElo.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-brand-pink/10 via-brand-yellow/5 to-brand-pink/10 dark:from-brand-pink/20 dark:via-brand-yellow/10 dark:to-brand-pink/20 rounded-card-lg p-6 shadow-soft-shadow border border-brand-pink/20 dark:border-brand-pink/30 relative"
    >
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
      
      <div className="relative z-10">
        {/* Título */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-pink" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Seu Comandante
            </h3>
          </div>
        </div>

        {/* Carrossel de Avatares */}
        <div className="flex flex-col items-center">
          <div className="relative w-full mb-6">
            {/* Container principal - Avatar centralizado */}
            <div className="flex items-center justify-center gap-2 md:gap-4 px-2 md:px-4">
              {/* Seta Esquerda */}
              <motion.button
                onClick={handlePrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0 z-10"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {/* Container dos Avatares - Centralizado com o principal no centro */}
              <div className="flex items-end justify-center gap-2 md:gap-3 flex-1 relative min-h-[150px] md:min-h-[200px]">
                {/* Avatar anterior (esquerda) */}
                {selectedIndex > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.3, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="relative rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 p-1.5 md:p-2 shadow-lg border-4 border-white dark:border-gray-800 w-14 h-14 md:w-16 md:h-16">
                      <img
                        src={getAvatarImage(elos[selectedIndex - 1])}
                        alt={`Pig-Man ${elos[selectedIndex - 1]}`}
                        className="w-full h-full object-contain rounded-full grayscale"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Avatar Principal (CENTRO) */}
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex-shrink-0"
                >
                  {/* Efeito de brilho ao redor do avatar (apenas se for o elo atual) */}
                  {isCurrentElo && (
                    <div className="absolute inset-0 bg-brand-pink/20 rounded-full blur-xl animate-pulse -z-10" />
                  )}
                  
                  {/* Avatar */}
                  <div className="relative rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 p-1.5 md:p-2 shadow-lg border-4 border-white dark:border-gray-800 w-36 h-36 md:w-48 md:h-48">
                    <img
                      src={getAvatarImage(selectedElo)}
                      alt={`Pig-Man ${selectedElo}`}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>

                  {/* Badge de Elo */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border-2 border-white dark:border-gray-800 whitespace-nowrap ${
                      isCurrentElo 
                        ? 'bg-brand-yellow text-white' 
                        : 'bg-gray-400 text-gray-700'
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    {selectedElo}
                  </motion.div>
                </motion.div>

                {/* Avatar próximo (direita) */}
                {selectedIndex < elos.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.3, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="relative rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 p-1.5 md:p-2 shadow-lg border-4 border-white dark:border-gray-800 w-14 h-14 md:w-16 md:h-16">
                      <img
                        src={getAvatarImage(elos[selectedIndex + 1])}
                        alt={`Pig-Man ${elos[selectedIndex + 1]}`}
                        className="w-full h-full object-contain rounded-full grayscale"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Seta Direita */}
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 flex-shrink-0 z-10"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>

          {/* Barra de progresso do Elo */}
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Elo {currentElo} • {eloProgress}% de progresso</span>
              <span className="text-xs font-semibold text-brand-pink">{eloProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${eloProgress}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-full bg-gradient-to-r from-brand-pink to-brand-yellow rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

