import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Brain, 
  TrendingUp, 
  User, 
  CreditCard, 
  Sparkles, 
  Settings,
  MessageCircle,
  Target,
  Repeat,
  DollarSign,
  Lightbulb,
  Link,
  FileText,
  X,
  Menu,
  Receipt,
  Map
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface HamburgerMenuProps {
  currentPage?: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions' | 'recurrences' | 'budgets' | 'tips' | 'bankConnections' | 'bankStatements' | 'transactions' | 'journey';
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions' | 'recurrences' | 'budgets' | 'tips' | 'bankConnections' | 'bankStatements' | 'transactions' | 'journey') => void;
}

interface MenuItem {
  id: string;
  icon: typeof Home;
  label: string;
  page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions' | 'recurrences' | 'budgets' | 'tips' | 'bankConnections' | 'bankStatements' | 'transactions' | 'journey';
  category: 'main' | 'secondary';
  color: string;
}

const menuItems: MenuItem[] = [
  // Principais
  { id: 'home', icon: Home, label: 'Início', page: 'home', category: 'main', color: 'text-brand-pink' },
  { id: 'strategy', icon: Brain, label: 'Estratégia', page: 'strategy', category: 'main', color: 'text-brand-green' },
  { id: 'journey', icon: Map, label: 'Jornada', page: 'journey', category: 'main', color: 'text-brand-pink' },
  { id: 'missions', icon: Target, label: 'Missões', page: 'missions', category: 'main', color: 'text-brand-yellow' },
  { id: 'chat', icon: MessageCircle, label: 'Chat', page: 'chat', category: 'main', color: 'text-brand-pink' },
  { id: 'patrimony', icon: TrendingUp, label: 'Patrimônio', page: 'patrimony', category: 'main', color: 'text-brand-yellow' },
  { id: 'profile', icon: User, label: 'Perfil', page: 'profile', category: 'main', color: 'text-brand-pink' },
  // Secundárias
  { id: 'cards', icon: CreditCard, label: 'Cartões', page: 'cards', category: 'secondary', color: 'text-gray-600 dark:text-gray-400' },
  { id: 'dreams', icon: Sparkles, label: 'Sonhos', page: 'dreams', category: 'secondary', color: 'text-brand-pink' },
  { id: 'recurrences', icon: Repeat, label: 'Recorrências', page: 'recurrences', category: 'secondary', color: 'text-brand-pink' },
  { id: 'budgets', icon: DollarSign, label: 'Categorias/Orçamentos', page: 'budgets', category: 'secondary', color: 'text-brand-pink' },
  { id: 'tips', icon: Lightbulb, label: 'Dicas do Pigman', page: 'tips', category: 'secondary', color: 'text-brand-yellow' },
  { id: 'transactions', icon: Receipt, label: 'Transações', page: 'transactions', category: 'secondary', color: 'text-brand-pink' },
  { id: 'bankConnections', icon: Link, label: 'Conexões Bancárias', page: 'bankConnections', category: 'secondary', color: 'text-brand-pink' },
  { id: 'bankStatements', icon: FileText, label: 'Adição por meio de extrato', page: 'bankStatements', category: 'secondary', color: 'text-brand-pink' },
  { id: 'settings', icon: Settings, label: 'Configurações', page: 'settings', category: 'secondary', color: 'text-gray-600 dark:text-gray-400' },
];

export default function HamburgerMenu({ currentPage, onNavigate }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevenir scroll do body quando menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (page: MenuItem['page']) => {
    onNavigate?.(page);
    setIsOpen(false);
  };

  const mainItems = menuItems.filter(item => item.category === 'main');
  const secondaryItems = menuItems.filter(item => item.category === 'secondary');

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Lateral */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            style={{ zIndex: 9999 }}
          >
              {/* Header do Menu */}
              <div className="bg-gradient-to-br from-brand-pink to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-2xl">🐷</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">PigMan</h2>
                      <p className="text-xs text-white/80">GPS Financeiro</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Conteúdo do Menu */}
              <div className="p-4 space-y-6">
                {/* Seção Principal */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Principais
                  </h3>
                  <div className="space-y-2">
                    {mainItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.page;

                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigate(item.page)}
                          className={`w-full flex items-center gap-4 p-4 rounded-card-lg transition-all ${
                            isActive
                              ? 'bg-brand-pink/10 dark:bg-brand-pink/20 border-2 border-brand-pink'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-card flex items-center justify-center ${
                            isActive
                              ? 'bg-brand-pink text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-semibold ${
                              isActive
                                ? 'text-brand-pink'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.label}
                            </p>
                            {isActive && (
                              <p className="text-xs text-brand-pink/70 mt-0.5">
                                Página atual
                              </p>
                            )}
                          </div>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-brand-pink"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Seção Secundária */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Mais Opções
                  </h3>
                  <div className="space-y-2">
                    {secondaryItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.page;

                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (mainItems.length + index) * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigate(item.page)}
                          className={`w-full flex items-center gap-4 p-4 rounded-card-lg transition-all ${
                            isActive
                              ? 'bg-brand-pink/10 dark:bg-brand-pink/20 border-2 border-brand-pink'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-card flex items-center justify-center ${
                            isActive
                              ? 'bg-brand-pink text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-semibold ${
                              isActive
                                ? 'text-brand-pink'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.label}
                            </p>
                          </div>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-brand-pink"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer do Menu */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-brand-pink/10 to-brand-green/10 dark:from-brand-pink/20 dark:to-brand-green/20 rounded-card-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center">
                        <span className="text-xl">🐷</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Continue sua jornada!
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Mantenha sua ofensiva ativa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );

  return (
    <>
      {/* Botão Hambúrguer */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-soft hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative z-50"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>

      {/* Renderizar menu via Portal diretamente no body */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}

