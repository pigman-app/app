import StrategyScreen from '../containers/StrategyScreen';

interface StrategyProps {
  onNavigate?: (page: 'home' | 'strategy' | 'patrimony' | 'profile' | 'cards' | 'dreams' | 'chat') => void;
}

export default function Strategy({ onNavigate }: StrategyProps) {
  return <StrategyScreen onNavigate={onNavigate} />;
}

