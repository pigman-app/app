import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles } from 'lucide-react';
import PlansCarousel from '../components/subscription/PlansCarousel';
import CommanderSettings from '../components/subscription/CommanderSettings';
import ImportHub from './ImportHub';

export default function SettingsScreen() {
  const [showImportHub, setShowImportHub] = useState(false);

  const handleUpgrade = (planId: string) => {
    console.log('Upgrade para plano:', planId);
    // Aqui você pode adicionar lógica de upgrade
  };

  if (showImportHub) {
    return <ImportHub onBack={() => setShowImportHub(false)} />;
  }

  return (
    <div className="space-y-6 overflow-visible">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie sua conta e assinatura
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <Settings className="w-6 h-6 text-brand-pink" />
        </div>
      </motion.div>

      {/* Planos de Assinatura */}
      <div className="overflow-visible">
        <PlansCarousel onUpgrade={handleUpgrade} />
      </div>

      {/* Botão para Hub de Importação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowImportHub(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow border-2 border-gray-200 dark:border-gray-700 hover:border-brand-pink transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-pink" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Hub de Importação
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Importe PDFs e planilhas com IA
              </p>
            </div>
          </div>
          <div className="text-brand-pink">
            →
          </div>
        </motion.button>
      </motion.div>

      {/* Configurações do Comandante */}
      <CommanderSettings />
    </div>
  );
}



