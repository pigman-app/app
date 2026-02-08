import { useState, useEffect } from 'react';
import BaseLayout from './components/Layout/BaseLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Strategy from './pages/Strategy';
import Patrimony from './pages/Patrimony';
import Profile from './pages/Profile';
import CardsScreen from './pages/CardsScreen';
import Dreams from './pages/Dreams';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Missions from './pages/Missions';

type Page = 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'settings' | 'chat' | 'missions';

// Função para verificar autenticação
const checkAuthentication = (): boolean => {
  const isAuthenticated = localStorage.getItem('pigman_authenticated');
  const authToken = localStorage.getItem('pigman_auth_token');
  
  if (!isAuthenticated || !authToken) {
    return false;
  }

  // Verificar se o token é válido decodificando
  try {
    const decoded = atob(authToken);
    const [email, password] = decoded.split(':');
    
    // Validar credenciais
    if (email === 'app.pigman@gmail.com' && password === '#PIGMAN123') {
      return true;
    }
  } catch (error) {
    // Token inválido
    return false;
  }

  return false;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Verificar autenticação ao carregar e sempre que a página mudar
  useEffect(() => {
    const authenticated = checkAuthentication();
    setIsAuthenticated(authenticated);
    setIsChecking(false);

    // Verificar autenticação periodicamente (a cada 1 segundo) para proteção adicional
    const interval = setInterval(() => {
      const stillAuthenticated = checkAuthentication();
      if (!stillAuthenticated && authenticated) {
        // Se perdeu autenticação, limpar e redirecionar
        localStorage.removeItem('pigman_authenticated');
        localStorage.removeItem('pigman_auth_token');
        setIsAuthenticated(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'strategy':
        return <Strategy onNavigate={setCurrentPage} />;
      case 'chat':
        return <Chat onNavigate={setCurrentPage} />;
      case 'patrimony':
        return <Patrimony />;
      case 'profile':
        return <Profile />;
      case 'cards':
        return <CardsScreen onNavigate={setCurrentPage} />;
      case 'dreams':
        return <Dreams onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings />;
      case 'missions':
        return <Missions />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-pink/10 via-brand-yellow/5 to-brand-pink/10 dark:from-brand-pink/20 dark:via-brand-yellow/10 dark:to-brand-pink/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-pink to-pink-600 flex items-center justify-center">
            <span className="text-3xl">🐷</span>
          </div>
          <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Se estiver autenticado, mostrar aplicação
  return (
    <BaseLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </BaseLayout>
  );
}

export default App;

