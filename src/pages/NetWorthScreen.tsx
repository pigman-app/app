import { motion } from 'framer-motion';
import { TrendingUp, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { netWorthData as initialNetWorthData, Asset, Liability, NetWorthData } from '../mocks/finances';
import NetWorthChart from '../components/NetWorth/NetWorthChart';
import AssetLiabilityItem from '../components/NetWorth/AssetLiabilityItem';
import EloEvolutionCard from '../components/NetWorth/EloEvolutionCard';
import AddEditModal from '../components/NetWorth/AddEditModal';
import ViewDetailModal from '../components/NetWorth/ViewDetailModal';

export default function NetWorthScreen() {
  const [netWorthData, setNetWorthData] = useState<NetWorthData>(() => {
    try {
      const saved = localStorage.getItem('pigman_networth');
      if (saved) {
        const data = JSON.parse(saved);
        // Recalcular net worth
        data.netWorth = data.assets.reduce((sum: number, asset: Asset) => sum + asset.value, 0) -
                        data.liabilities.reduce((sum: number, liability: Liability) => sum + liability.value, 0);
        return data;
      }
    } catch {
      // Fallback para dados iniciais
    }
    return initialNetWorthData;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Asset | Liability | null>(null);
  const [viewingItem, setViewingItem] = useState<Asset | Liability | null>(null);
  const [viewingType, setViewingType] = useState<'asset' | 'liability'>('asset');
  const [addModalType, setAddModalType] = useState<'asset' | 'liability' | undefined>(undefined);

  useEffect(() => {
    // Salvar no localStorage sempre que houver mudanças
    localStorage.setItem('pigman_networth', JSON.stringify(netWorthData));
  }, [netWorthData]);

  const assetsTotal = netWorthData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const liabilitiesTotal = netWorthData.liabilities.reduce((sum, liability) => sum + liability.value, 0);
  
  // Calcular progresso para evolução do Elo (exemplo: 0-100% baseado no net worth)
  // Assumindo que R$ 10.000+ leva para Prata
  const eloProgress = Math.min(100, (netWorthData.netWorth / 10000) * 100);

  const handleSave = (item: Asset | Liability, type: 'asset' | 'liability') => {
    if (editingItem) {
      // Editar existente - recalcular net worth
      const oldValue = editingItem.value;
      const newValue = item.value;
      const valueDiff = type === 'asset' ? (newValue - oldValue) : (oldValue - newValue);
      
      if (type === 'asset') {
        setNetWorthData(prev => ({
          ...prev,
          assets: prev.assets.map(a => a.id === item.id ? item as Asset : a),
          netWorth: prev.netWorth + valueDiff
        }));
      } else {
        setNetWorthData(prev => ({
          ...prev,
          liabilities: prev.liabilities.map(l => l.id === item.id ? item as Liability : l),
          netWorth: prev.netWorth + valueDiff
        }));
      }
      setEditingItem(null);
    } else {
      // Adicionar novo
      if (type === 'asset') {
        setNetWorthData(prev => ({
          ...prev,
          assets: [...prev.assets, item as Asset],
          netWorth: prev.netWorth + item.value
        }));
      } else {
        setNetWorthData(prev => ({
          ...prev,
          liabilities: [...prev.liabilities, item as Liability],
          netWorth: prev.netWorth - item.value
        }));
      }
    }
  };

  const handleEdit = (item: Asset | Liability) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleView = (item: Asset | Liability) => {
    setViewingItem(item);
    setViewingType(netWorthData.assets.some(a => a.id === item.id) ? 'asset' : 'liability');
    setShowViewModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

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
            Patrimônio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visão completa dos seus ativos e passivos
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-brand-green" />
        </div>
      </motion.div>

      {/* Net Worth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-card-lg p-6 shadow-soft-shadow"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Patrimônio Líquido
        </p>
        <h2 className={`text-3xl font-bold mb-4 ${
          netWorthData.netWorth >= 0 
            ? 'text-brand-green' 
            : 'text-brand-pink'
        }`}>
          {formatCurrency(netWorthData.netWorth)}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total de Ativos</p>
            <p className="font-semibold text-brand-green">
              {formatCurrency(assetsTotal)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Total de Passivos</p>
            <p className="font-semibold text-brand-pink">
              {formatCurrency(liabilitiesTotal)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Gestão */}
      <NetWorthChart 
        assetsTotal={assetsTotal} 
        liabilitiesTotal={liabilitiesTotal} 
      />

      {/* Card de Evolução do Elo */}
      <EloEvolutionCard
        currentElo="Bronze"
        nextElo="Prata"
        netWorth={netWorthData.netWorth}
        progress={eloProgress}
      />

      {/* Lista de Ativos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ativos
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingItem(null);
              setAddModalType('asset');
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 rounded-card bg-brand-green text-white text-sm font-semibold flex items-center gap-1.5 shadow-soft-shadow hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </div>
        <div className="space-y-3">
          {netWorthData.assets.map((asset, index) => (
            <AssetLiabilityItem
              key={asset.id}
              item={asset}
              index={index}
              type="asset"
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
          {netWorthData.assets.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum ativo cadastrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Passivos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Passivos
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingItem(null);
              setAddModalType('liability');
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 rounded-card bg-brand-pink text-white text-sm font-semibold flex items-center gap-1.5 shadow-soft-shadow hover:bg-pink-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </div>
        <div className="space-y-3">
          {netWorthData.liabilities.map((liability, index) => (
            <AssetLiabilityItem
              key={liability.id}
              item={liability}
              index={index}
              type="liability"
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
          {netWorthData.liabilities.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum passivo cadastrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
          setAddModalType(undefined);
        }}
        onSave={handleSave}
        item={editingItem || undefined}
        type={editingItem 
          ? (netWorthData.assets.some(a => a.id === editingItem.id) ? 'asset' : 'liability')
          : addModalType
        }
      />

      {viewingItem && (
        <ViewDetailModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setViewingItem(null);
          }}
          item={viewingItem}
          type={viewingType}
        />
      )}
    </div>
  );
}



