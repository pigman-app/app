import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Brain, TrendingUp, User, MessageCircle, Target } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';

// Função para verificar autenticação
const checkAuthentication = (): boolean => {
  const isAuthenticated = localStorage.getItem('pigman_authenticated');
  const authToken = localStorage.getItem('pigman_auth_token');
  
  if (!isAuthenticated || !authToken) {
    return false;
  }

  try {
    const decoded = atob(authToken);
    const [email, password] = decoded.split(':');
    
    if (email === 'app.pigman@gmail.com' && password === '#PIGMAN123') {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

interface BaseLayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions';
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions') => void;
}

const navigationItems = [
  { id: 'home', icon: Home, label: 'Início', page: 'home' as const },
  { id: 'strategy', icon: Brain, label: 'Estratégia', page: 'strategy' as const },
  { id: 'missions', icon: Target, label: 'Missões', page: 'missions' as const },
  { id: 'patrimony', icon: TrendingUp, label: 'Patrimônio', page: 'patrimony' as const },
  { id: 'profile', icon: User, label: 'Perfil', page: 'profile' as const },
];

export default function BaseLayout({ children, currentPage = 'home', onNavigate }: BaseLayoutProps) {
  // Proteção adicional - verificar autenticação sempre que o componente renderizar
  useEffect(() => {
    const authenticated = checkAuthentication();
    if (!authenticated) {
      // Limpar localStorage e recarregar página para forçar login
      localStorage.removeItem('pigman_authenticated');
      localStorage.removeItem('pigman_auth_token');
      window.location.reload();
    }
  }, [currentPage]); // Verificar sempre que a página mudar

  return (
    <div className="min-h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark">
      {/* Container Mobile-First */}
      <div className="container-mobile min-h-screen flex flex-col">
        {/* Header com Menu Hambúrguer */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container-mobile px-4 py-3">
            <div className="flex items-center justify-between">
              <HamburgerMenu currentPage={currentPage} onNavigate={onNavigate} />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center">
                  <span className="text-sm">🐷</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">PigMan</span>
              </div>
              <div className="w-10" /> {/* Spacer para centralizar */}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 pb-20 overflow-y-auto overflow-x-hidden ${
          currentPage === 'chat' ? 'px-0 pt-0' : 'px-4 pt-4'
        }`}>
          <div className={`max-w-full ${currentPage === 'chat' ? 'h-full' : ''}`}>
            {children}
          </div>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-bg-dark border-t border-gray-200 dark:border-gray-700 shadow-soft z-30">
          <div className="container-mobile">
            <div className="flex justify-around items-center h-16">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                
                return (
                  <motion.button
                    key={item.id}
                    className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
                    whileTap={{ scale: 0.95 }}
                    aria-label={item.label}
                    onClick={() => onNavigate?.(item.page)}
                  >
                    <Icon
                      size={22}
                      className={`transition-colors ${
                        isActive
                          ? 'text-pig dark:text-pig'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        isActive
                          ? 'text-pig dark:text-pig'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-pig rounded-b-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

