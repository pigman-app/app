import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Award, Sparkles, ChevronDown, X,
  Star, Target, Coins, Trophy, Flame, Zap, Heart, Shield,
  Snowflake, CloudSun, Flower2, Sun, Umbrella, Leaf,
  Wind, Moon, CloudRain, Mountain, Gift,
  PartyPopper, Crown,
} from 'lucide-react';
import { dashboardData } from '../mocks/userDashboard';
import { gamificationData } from '../mocks/gamification';
import { dreamsData, getDreamProgress } from '../mocks/dreams';
import { debtStrategy } from '../mocks/strategy';
import pigManBronze from '../assests/pig-man-bronze.png';
import pigManSilver from '../assests/pig-man-silver.png';
import pigManGold from '../assests/pig-man-gold.png';
import pigManPlatinium from '../assests/pig-man-platinium.png';
import pigManMaster from '../assests/pig-man-master.png';

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const MONTH_ICONS = [
  Snowflake, Heart, Flower2, CloudSun, Sun, Umbrella,
  Wind, Leaf, CloudRain, Moon, Mountain, Gift,
];

const MONTH_EMOJIS = ['❄️', '💕', '🌸', '☀️', '🌞', '☂️', '🌬️', '🍂', '🌧️', '🌙', '⛰️', '🎁'];

const WEEK_ICONS = [Star, Target, Coins, Trophy];
const WEEK_EMOJIS = ['⭐', '🎯', '💰', '🏆'];

// Mock: some past week IDs that were skipped
const SKIPPED_WEEK_IDS = new Set([3, 8, 9]);

const WEEK_MISSIONS = [
  [
    { title: 'Sentinela', desc: 'Registrar 3 gastos hoje', icon: '📝', xp: 30 },
    { title: 'Economista', desc: 'Não gastar mais de R$ 50 em lazer', icon: '💡', xp: 50 },
    { title: 'Organizador', desc: 'Categorizar todos os gastos do dia', icon: '📂', xp: 20 },
  ],
  [
    { title: 'Poupador', desc: 'Guardar R$ 100 na reserva', icon: '🐷', xp: 75 },
    { title: 'Caçador de Ofertas', desc: 'Registrar uma economia no mercado', icon: '🏷️', xp: 40 },
    { title: 'Planejador', desc: 'Revisar seu orçamento mensal', icon: '📊', xp: 50 },
  ],
  [
    { title: 'Investidor', desc: 'Pesquisar uma opção de investimento', icon: '📈', xp: 60 },
    { title: 'Negociador', desc: 'Renegociar uma conta recorrente', icon: '🤝', xp: 80 },
    { title: 'Disciplinado', desc: 'Manter streak de 3 dias', icon: '🔥', xp: 45 },
  ],
  [
    { title: 'Mestre do Mês', desc: 'Fechar o mês no positivo', icon: '🏆', xp: 100 },
    { title: 'Visionário', desc: 'Atualizar seu Mapa de Sonhos', icon: '✨', xp: 50 },
    { title: 'Balanço Final', desc: 'Registrar todos os gastos da semana', icon: '📋', xp: 60 },
  ],
];

type TrailMode = 'dreams' | 'escape';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getAvatarImage = (elo: string): string => {
  const avatarMap: Record<string, string> = {
    bronze: pigManBronze,
    prata: pigManSilver,
    ouro: pigManGold,
    platina: pigManPlatinium,
    mestre: pigManMaster,
  };
  return avatarMap[elo.toLowerCase()] || avatarMap.bronze;
};

const getWeekOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  return Math.min(Math.ceil((dayOfMonth + firstDay.getDay()) / 7), 4);
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface Checkpoint {
  id: number;
  type: 'month' | 'week';
  label: string;
  monthIndex: number;
  weekIndex?: number;
  completed: boolean;
  skipped: boolean;
  isCurrent: boolean;
}

interface MissionPopup {
  weekIndex: number;
  monthLabel: string;
  missions: { title: string; desc: string; icon: string; xp: number }[];
}

// ─── Offset: months at extremes, alternating left/right ──────────────────────

const getCheckpointOffset = (index: number): number => {
  const group = Math.floor(index / 5);
  const pos = index % 5;
  const isLeft = group % 2 === 0;
  // Month at edge (±90), weeks transition linearly to opposite edge
  const steps = [-90, -45, 0, 45, 90];
  return isLeft ? steps[pos] : -steps[pos];
};

// ─── Generate data ──────────────────────────────────────────────────────────

const generateCheckpoints = (): Checkpoint[] => {
  const cps: Checkpoint[] = [];
  const now = new Date();
  const curMonth = now.getMonth();
  const curWeek = getWeekOfMonth(now);

  MONTHS.forEach((month, mi) => {
    const past = mi < curMonth;
    cps.push({
      id: cps.length, type: 'month', label: month, monthIndex: mi,
      completed: past, skipped: false, isCurrent: mi === curMonth,
    });
    for (let w = 1; w <= 4; w++) {
      const wid = cps.length;
      const pastW = mi < curMonth || (mi === curMonth && w < curWeek);
      const skip = pastW && SKIPPED_WEEK_IDS.has(wid);
      cps.push({
        id: wid, type: 'week', label: `Semana ${w}`, monthIndex: mi, weekIndex: w,
        completed: pastW && !skip, skipped: skip,
        isCurrent: mi === curMonth && w === curWeek,
      });
    }
  });
  return cps;
};

// ─── Background decorative elements ─────────────────────────────────────────

const BG_DECORATIONS = [
  // Clouds - bigger and more visible
  { emoji: '☁️', top: 100, left: 5, size: 44, opacity: 0.25 },
  { emoji: '☁️', top: 500, left: 280, size: 52, opacity: 0.22 },
  { emoji: '☁️', top: 950, left: 10, size: 48, opacity: 0.2 },
  { emoji: '☁️', top: 1500, left: 300, size: 50, opacity: 0.22 },
  { emoji: '☁️', top: 2100, left: 15, size: 46, opacity: 0.2 },
  { emoji: '☁️', top: 2700, left: 290, size: 52, opacity: 0.22 },
  { emoji: '☁️', top: 3300, left: 5, size: 44, opacity: 0.18 },
  { emoji: '☁️', top: 3900, left: 300, size: 50, opacity: 0.2 },
  { emoji: '☁️', top: 4500, left: 10, size: 48, opacity: 0.22 },
  // Sparkles and stars - brighter
  { emoji: '✨', top: 250, left: 340, size: 28, opacity: 0.35 },
  { emoji: '⭐', top: 400, left: 30, size: 22, opacity: 0.3 },
  { emoji: '✨', top: 680, left: 15, size: 24, opacity: 0.35 },
  { emoji: '🌟', top: 850, left: 350, size: 20, opacity: 0.3 },
  { emoji: '⭐', top: 1100, left: 340, size: 24, opacity: 0.28 },
  { emoji: '✨', top: 1350, left: 20, size: 26, opacity: 0.32 },
  { emoji: '🌟', top: 1650, left: 350, size: 22, opacity: 0.3 },
  { emoji: '⭐', top: 1900, left: 25, size: 24, opacity: 0.28 },
  { emoji: '✨', top: 2250, left: 340, size: 28, opacity: 0.35 },
  { emoji: '🌟', top: 2550, left: 15, size: 22, opacity: 0.3 },
  { emoji: '⭐', top: 2850, left: 350, size: 24, opacity: 0.28 },
  { emoji: '✨', top: 3150, left: 25, size: 26, opacity: 0.32 },
  { emoji: '🌟', top: 3450, left: 340, size: 22, opacity: 0.3 },
  { emoji: '⭐', top: 3750, left: 20, size: 24, opacity: 0.28 },
  { emoji: '✨', top: 4050, left: 350, size: 28, opacity: 0.35 },
  { emoji: '🌟', top: 4350, left: 15, size: 22, opacity: 0.3 },
  { emoji: '⭐', top: 4650, left: 340, size: 24, opacity: 0.28 },
  // Coins and trees for scenery
  { emoji: '🪙', top: 320, left: 360, size: 20, opacity: 0.25 },
  { emoji: '🌳', top: 750, left: 370, size: 28, opacity: 0.2 },
  { emoji: '🪙', top: 1250, left: 5, size: 20, opacity: 0.25 },
  { emoji: '🌳', top: 1800, left: 370, size: 26, opacity: 0.2 },
  { emoji: '🪙', top: 2400, left: 360, size: 22, opacity: 0.25 },
  { emoji: '🌳', top: 3000, left: 5, size: 28, opacity: 0.2 },
  { emoji: '🪙', top: 3600, left: 370, size: 20, opacity: 0.25 },
  { emoji: '🌳', top: 4200, left: 5, size: 26, opacity: 0.2 },
  { emoji: '🏦', top: 600, left: 365, size: 22, opacity: 0.18 },
  { emoji: '💎', top: 1950, left: 365, size: 18, opacity: 0.22 },
  { emoji: '🏦', top: 3500, left: 5, size: 22, opacity: 0.18 },
  { emoji: '💎', top: 4800, left: 365, size: 18, opacity: 0.22 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FinanceJourney() {
  const { pigMan } = dashboardData;
  const { eloProgress, nextElo } = gamificationData;

  const [trailMode, setTrailMode] = useState<TrailMode>('dreams');
  const [selectedItem, setSelectedItem] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [missionPopup, setMissionPopup] = useState<MissionPopup | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLDivElement>(null);

  const checkpoints = generateCheckpoints();
  const now = new Date();
  const currentMonthName = MONTHS[now.getMonth()];
  const currentWeek = getWeekOfMonth(now);

  // Trail options
  const dreamOptions = dreamsData
    .filter(d => d.status === 'active')
    .map(d => ({ id: d.id, label: `${d.icon} ${d.title}`, progress: getDreamProgress(d) }));
  const debtOptions = debtStrategy.debts.map(d => ({
    id: d.id, label: `💳 ${d.name}`,
    progress: Math.min(100, ((d.amount - d.suggestedPayment * d.monthsToPay + d.suggestedPayment * 2) / d.amount) * 100),
  }));
  const options = trailMode === 'dreams' ? dreamOptions : debtOptions;

  useEffect(() => {
    if (options.length > 0 && !selectedItem) setSelectedItem(options[0].id);
  }, [trailMode, options, selectedItem]);

  const selectedOption = options.find(o => o.id === selectedItem) || options[0];
  const progressPercent = selectedOption?.progress ?? 0;

  useEffect(() => {
    const t = setTimeout(() => {
      currentNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleWeekClick = (cp: Checkpoint) => {
    if (cp.type !== 'week' || !cp.weekIndex) return;
    setMissionPopup({
      weekIndex: cp.weekIndex,
      monthLabel: MONTHS[cp.monthIndex],
      missions: WEEK_MISSIONS[(cp.weekIndex - 1) % 4],
    });
  };

  // ─── Layout ──────────────────────────────────────────────────────────────

  const NODE_SPACING = 90;
  const CENTER_X = 190;
  const CONGRATS_TOP = 70 + checkpoints.length * NODE_SPACING + 30; // card starts right after last checkpoint
  const totalHeight = CONGRATS_TOP + 300; // card height ~260 + padding

  const pathPoints = checkpoints.map((_, i) => ({
    x: CENTER_X + getCheckpointOffset(i),
    y: 70 + i * NODE_SPACING,
  }));

  // Straight lines SVG path — extends to the Congratulations card center
  let svgPath = '';
  if (pathPoints.length > 0) {
    svgPath = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      svgPath += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }
    // Extend line to the top-center of the congrats card
    svgPath += ` L ${CENTER_X} ${CONGRATS_TOP + 10}`;
  }

  // Pig-Man
  const currentIndex = checkpoints.findIndex(cp => cp.isCurrent);
  const pigManPoint = currentIndex >= 0 ? pathPoints[currentIndex] : null;
  const pigManOffset = currentIndex >= 0 ? getCheckpointOffset(currentIndex) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ─── Sticky Header ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-mobile px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-brand-pink" />
            <h2 className="text-lg font-bold text-gray-900">Jornada do Comandante</h2>
          </div>

          {/* Trail Mode Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setTrailMode('dreams'); setSelectedItem(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${trailMode === 'dreams'
                ? 'bg-gradient-to-r from-brand-pink to-pink-600 text-white shadow-lg shadow-pink-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                MAPA DOS SONHOS
              </span>
            </button>
            <button
              onClick={() => { setTrailMode('escape'); setSelectedItem(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${trailMode === 'escape'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-orange-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Shield className="w-4 h-4" />
                ROTA DE FUGA
              </span>
            </button>
          </div>

          {/* Dropdown */}
          {options.length > 0 && (
            <div className="relative mb-3">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 hover:border-brand-pink/40 transition-colors"
              >
                <span className="truncate">{selectedOption?.label || 'Selecionar...'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setSelectedItem(opt.id); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${opt.id === selectedItem ? 'bg-brand-pink/5 text-brand-pink font-semibold' : 'text-gray-700'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {trailMode === 'dreams' ? 'Progresso do Sonho' : 'Progresso da Quitação'}
              </span>
              <span className="text-xs font-bold text-brand-pink">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full rounded-full ${trailMode === 'dreams'
                  ? 'bg-gradient-to-r from-brand-pink to-brand-yellow'
                  : 'bg-gradient-to-r from-red-500 to-orange-400'
                  }`}
              />
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              Mês: <span className="font-bold text-gray-900">{currentMonthName}</span>
            </span>
            <span className="text-sm text-gray-600">
              Semana <span className="font-bold text-brand-pink">{currentWeek}</span>
            </span>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-brand-yellow" />
              <span className="text-xs font-bold text-brand-yellow">{pigMan.streak}d</span>
            </div>
          </div>

          {/* Elo Progress */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Próximo Elo: {nextElo}</span>
              <span className="text-xs font-semibold text-brand-pink">{eloProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${eloProgress}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full bg-gradient-to-r from-brand-pink to-brand-yellow rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trail Area ───────────────────────────────────────────────────── */}
      <div ref={scrollRef} className="container-mobile px-2 pt-4">
        <div className="relative" style={{ minHeight: `${totalHeight}px` }}>

          {/* ── Background decorations ────────────────────────────────────── */}
          {BG_DECORATIONS.map((d, i) => (
            <motion.div
              key={`deco-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: d.opacity, y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 1, delay: i * 0.15 },
                y: { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
              }}
              className="absolute pointer-events-none select-none"
              style={{ top: d.top, left: d.left, fontSize: d.size }}
            >
              {d.emoji}
            </motion.div>
          ))}

          {/* Gradient blobs - more visible */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, top: 200, left: -80, background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 240, height: 240, top: 800, right: -60, background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 280, height: 280, top: 1500, left: -70, background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 240, height: 240, top: 2200, right: -80, background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, top: 3000, left: -60, background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 240, height: 240, top: 3800, right: -70, background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, top: 4500, left: -80, background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />

          {/* SVG Straight Lines */}
          <svg
            className="absolute inset-0 w-full"
            style={{ height: `${totalHeight}px` }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Shadow */}
            <path d={svgPath} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            {/* Main line */}
            <path d={svgPath} fill="none" stroke="url(#trailGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)" />
          </svg>

          {/* ─── Checkpoints ─────────────────────────────────────────────── */}
          {checkpoints.map((cp, index) => {
            const offset = getCheckpointOffset(index);
            const x = CENTER_X + offset;
            const y = 70 + index * NODE_SPACING;
            const isMonth = cp.type === 'month';
            const MonthIcon = isMonth ? MONTH_ICONS[cp.monthIndex] : null;
            const WeekIcon = !isMonth && cp.weekIndex ? WEEK_ICONS[(cp.weekIndex - 1) % 4] : null;
            const { isCurrent, completed: isCompleted, skipped: isSkipped } = cp;

            const nodeSize = isMonth ? 80 : 60;
            const iconSize = isMonth ? 34 : 26;

            // KEY FIX: label goes on the OPPOSITE side of the offset
            // Checkpoint on left (offset < 0) → label on RIGHT
            // Checkpoint on right (offset > 0) → label on LEFT
            // Checkpoint at center (offset = 0) → label on RIGHT (default)
            const labelOnRight = offset <= 0;

            return (
              <motion.div
                key={cp.id}
                ref={isCurrent ? currentNodeRef : undefined}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.012 }}
                className="absolute"
                style={{
                  left: `${x - nodeSize / 2}px`,
                  top: `${y - nodeSize / 2}px`,
                  zIndex: isCurrent ? 20 : 10,
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleWeekClick(cp)}
                  className="relative flex items-center justify-center"
                  style={{ width: nodeSize, height: nodeSize }}
                >
                  {/* Pulse ring */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute rounded-full"
                      style={{
                        width: nodeSize + 20, height: nodeSize + 20,
                        background: 'radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${isSkipped
                      ? 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-200'
                      : isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200'
                        : isCurrent
                          ? 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-200'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300'
                      }`}
                    style={{
                      border: isCurrent ? '4px solid #EAB308'
                        : isMonth ? '3px solid white' : '2px solid white',
                      boxShadow: isCurrent
                        ? '0 0 24px rgba(236,72,153,0.5), inset 0 2px 3px rgba(255,255,255,0.3)'
                        : isSkipped
                          ? '0 4px 16px rgba(245,158,11,0.35)'
                          : isCompleted
                            ? '0 4px 14px rgba(34,197,94,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Always show the original icon — color indicates status */}
                    {isMonth && MonthIcon ? (
                      <MonthIcon className="text-white" style={{ width: iconSize, height: iconSize }} />
                    ) : WeekIcon ? (
                      <WeekIcon className="text-white" style={{ width: iconSize, height: iconSize }} />
                    ) : (
                      <div className="rounded-full bg-white" style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                    )}
                  </div>
                </motion.button>

                {/* ── Month label ──────────────────────────────────────────── */}
                {isMonth && (
                  <div
                    className="absolute whitespace-nowrap"
                    style={{
                      left: labelOnRight ? `${nodeSize + 10}px` : 'auto',
                      right: !labelOnRight ? `${nodeSize + 10}px` : 'auto',
                      top: '50%', transform: 'translateY(-50%)',
                    }}
                  >
                    <div className={`flex items-center gap-2 ${!labelOnRight ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xl">{MONTH_EMOJIS[cp.monthIndex]}</span>
                      <div className={!labelOnRight ? 'text-right' : ''}>
                        <span className={`text-base font-extrabold block leading-tight ${isCompleted ? 'text-green-600' : isCurrent ? 'text-pink-600' : 'text-gray-400'
                          }`}>
                          {cp.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5">
                            <Award className="w-3 h-3" /> Concluído
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] text-pink-500 font-semibold flex items-center gap-0.5">
                            <Zap className="w-3 h-3" /> Atual
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Skipped week label ───────────────────────────────────── */}
                {!isMonth && isSkipped && (
                  <div
                    className="absolute whitespace-nowrap"
                    style={{
                      left: labelOnRight ? `${nodeSize + 6}px` : 'auto',
                      right: !labelOnRight ? `${nodeSize + 6}px` : 'auto',
                      top: '50%', transform: 'translateY(-50%)',
                    }}
                  >
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⚠️ Não concluído
                    </span>
                  </div>
                )}

                {/* ── Current week label ───────────────────────────────────── */}
                {!isMonth && isCurrent && (
                  <div
                    className="absolute whitespace-nowrap"
                    style={{
                      left: labelOnRight ? `${nodeSize + 6}px` : 'auto',
                      right: !labelOnRight ? `${nodeSize + 6}px` : 'auto',
                      top: '50%', transform: 'translateY(-50%)',
                    }}
                  >
                    <span className="text-xs font-bold text-pink-500 flex items-center gap-1 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
                      {WEEK_EMOJIS[(cp.weekIndex! - 1) % 4]} {cp.label}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* ─── Pig-Man Avatar ───────────────────────────────────────────── */}
          {pigManPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute"
              style={{
                // Same side as label (opposite of offset direction), offset a bit further
                left: pigManOffset <= 0
                  ? `${pigManPoint.x + 24 + 48}px`
                  : `${pigManPoint.x - 24 - 48 - 80}px`,
                top: `${pigManPoint.y - 40}px`,
                zIndex: 30,
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/10 blur-sm" />
                <div
                  className="relative rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-yellow/20 p-1.5 border-[3px] border-brand-pink"
                  style={{ width: 80, height: 80, boxShadow: '0 8px 25px rgba(236,72,153,0.35)' }}
                >
                  <img src={getAvatarImage(pigMan.elo)} alt={`Pig-Man ${pigMan.elo}`} className="w-full h-full object-contain rounded-full" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-yellow text-white text-[10px] font-bold shadow-lg flex items-center gap-1 border-2 border-white whitespace-nowrap"
                >
                  <Award className="w-3 h-3" />
                  {pigMan.elo}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ─── CONGRATULATIONS Card at the end ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute left-2 right-2"
            style={{ top: `${CONGRATS_TOP}px` }}
          >
            <div
              className="relative overflow-hidden rounded-3xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 25%, #EAB308 50%, #22C55E 75%, #10B981 100%)',
                boxShadow: '0 8px 32px rgba(236,72,153,0.3), 0 4px 16px rgba(34,197,94,0.2)',
              }}
            >
              {/* Sparkle overlay */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute text-white/30"
                    style={{
                      top: `${10 + (i * 17) % 80}%`,
                      left: `${5 + (i * 23) % 90}%`,
                      fontSize: 10 + (i % 4) * 4,
                    }}
                  >
                    ✦
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-3"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-black text-white tracking-wide mb-1"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                >
                  🎉 CONGRATULATIONS 🎉
                </h3>
                <p className="text-white/90 text-sm font-semibold mb-2">
                  Você completou a Jornada Anual!
                </p>
                <p className="text-white/70 text-xs">
                  Continue assim, Comandante — o próximo ano será ainda melhor!
                </p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <PartyPopper className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">12 Meses</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">48 Semanas</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">Master</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ─── Mission Popup (centered) ─────────────────────────────────────── */}
      <AnimatePresence>
        {missionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setMissionPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    📋 Missões — {missionPopup.monthLabel}
                  </h3>
                  <p className="text-sm text-gray-500">Semana {missionPopup.weekIndex}</p>
                </div>
                <button
                  onClick={() => setMissionPopup(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {missionPopup.missions.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-pink/30 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-pink/10 to-brand-yellow/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900">{m.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-yellow/10 flex-shrink-0">
                      <Zap className="w-3 h-3 text-brand-yellow" />
                      <span className="text-xs font-bold text-brand-yellow">{m.xp} XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMissionPopup(null)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-pink to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-200 hover:shadow-xl transition-shadow"
                >
                  Aceitar Missões 🚀
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
