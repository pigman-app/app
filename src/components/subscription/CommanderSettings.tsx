import { motion } from 'framer-motion';
import { User, Mail, Shield, Key, Bell } from 'lucide-react';
import { userSettings } from '../../mocks/settings';

export default function CommanderSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-card bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center">
          <User className="w-6 h-6 text-brand-pink" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Configurações do Comandante
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie seu perfil e preferências
          </p>
        </div>
      </div>

      {/* Avatar e Elo */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-card">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center text-3xl shadow-soft">
          {userSettings.avatar}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 dark:text-white">
            {userSettings.userName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Elo {userSettings.elo}
          </p>
        </div>
      </div>

      {/* Informações do Usuário */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            defaultValue={userSettings.userName}
            className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            E-mail
          </label>
          <input
            type="email"
            defaultValue={userSettings.email}
            className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>
      </div>

      {/* Permissões RBAC/ABAC (Visual) */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-brand-pink" />
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Permissões e Segurança
          </h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Autenticação de Dois Fatores
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-600 relative"
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5"
                animate={{ x: 0 }}
              />
              <span className="text-xs text-gray-500">Desativado</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-card">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Notificações Push
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-6 rounded-full bg-brand-pink relative"
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5"
                animate={{ x: 0 }}
              />
              <span className="text-xs text-white">Ativo</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 bg-brand-pink text-white font-semibold py-3 rounded-card shadow-soft-shadow hover:bg-pink-600 transition-colors"
      >
        Salvar Alterações
      </motion.button>
    </motion.div>
  );
}



