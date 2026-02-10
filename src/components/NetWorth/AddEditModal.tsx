import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, PiggyBank, Home, CreditCard, DollarSign, Building2 } from 'lucide-react';
import { Asset, Liability } from '../../mocks/finances';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Asset | Liability, type: 'asset' | 'liability') => void;
  item?: Asset | Liability;
  type?: 'asset' | 'liability';
}

const assetTypes = [
  { value: 'emergency', label: 'Reserva de Emergência', icon: PiggyBank },
  { value: 'investment', label: 'Investimento', icon: TrendingUp },
  { value: 'property', label: 'Propriedade', icon: Home },
  { value: 'other', label: 'Outro', icon: DollarSign },
];

const liabilityTypes = [
  { value: 'loan', label: 'Empréstimo', icon: DollarSign },
  { value: 'credit-card', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'financing', label: 'Financiamento', icon: Building2 },
  { value: 'other', label: 'Outro', icon: DollarSign },
];

const iconOptions = [
  { value: 'PiggyBank', label: 'Cofrinho', icon: PiggyBank },
  { value: 'TrendingUp', label: 'Investimento', icon: TrendingUp },
  { value: 'Home', label: 'Casa', icon: Home },
  { value: 'CreditCard', label: 'Cartão', icon: CreditCard },
  { value: 'DollarSign', label: 'Dinheiro', icon: DollarSign },
];

export default function AddEditModal({ isOpen, onClose, onSave, item, type: initialType }: AddEditModalProps) {
  const [selectedType, setSelectedType] = useState<'asset' | 'liability'>(initialType || 'asset');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [itemType, setItemType] = useState<string>('');
  const [icon, setIcon] = useState('PiggyBank');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [installments, setInstallments] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setValue(item.value.toString().replace('.', ','));
      setItemType(item.type);
      setIcon(item.icon);
      setDescription(item.description || '');
      setDate(item.date || '');
      setNotes(item.notes || '');
      if ('interestRate' in item) {
        setInterestRate(item.interestRate?.toString().replace('.', ',') || '');
        setInstallments(item.installments?.toString() || '');
        setTotalInstallments(item.totalInstallments?.toString() || '');
      }
      setSelectedType(initialType || ('value' in item && 'type' in item ? 'asset' : 'liability'));
    } else {
      // Reset form
      setName('');
      setValue('');
      setItemType('');
      setIcon('PiggyBank');
      setDescription('');
      setDate('');
      setNotes('');
      setInterestRate('');
      setInstallments('');
      setTotalInstallments('');
      setSelectedType(initialType || 'asset');
    }
  }, [item, isOpen, initialType]);

  const handleSave = () => {
    if (!name || !value || !itemType) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const baseData: any = {
      id: item?.id || Date.now().toString(),
      name,
      value: parseFloat(value.replace(',', '.')),
      type: itemType as any,
      icon,
      description: description || undefined,
      date: date || undefined,
      notes: notes || undefined,
    };

    if (selectedType === 'liability') {
      const liability: Liability = {
        ...baseData,
        interestRate: interestRate ? parseFloat(interestRate.replace(',', '.')) : undefined,
        installments: installments ? parseInt(installments) : undefined,
        totalInstallments: totalInstallments ? parseInt(totalInstallments) : undefined,
      };
      onSave(liability, 'liability');
    } else {
      const asset: Asset = baseData;
      onSave(asset, 'asset');
    }

    onClose();
  };

  const types = selectedType === 'asset' ? assetTypes : liabilityTypes;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-soft-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {item ? 'Editar' : 'Adicionar'} {selectedType === 'asset' ? 'Ativo' : 'Passivo'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Tipo: Ativo ou Passivo */}
            {!item && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType('asset')}
                    className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                      selectedType === 'asset'
                        ? 'border-brand-green bg-brand-green/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <TrendingUp className={`w-5 h-5 ${selectedType === 'asset' ? 'text-brand-green' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${selectedType === 'asset' ? 'text-brand-green' : 'text-gray-400'}`}>
                      Ativo
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType('liability')}
                    className={`p-3 rounded-card border-2 flex items-center gap-2 ${
                      selectedType === 'liability'
                        ? 'border-brand-pink bg-brand-pink/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <TrendingDown className={`w-5 h-5 ${selectedType === 'liability' ? 'text-brand-pink' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${selectedType === 'liability' ? 'text-brand-pink' : 'text-gray-400'}`}>
                      Passivo
                    </span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Nome */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Ex: Reserva de Emergência"
              />
            </div>

            {/* Valor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor (R$) *
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^\d,.-]/g, ''))}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            {/* Tipo específico */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => {
                  const IconComponent = t.icon;
                  return (
                    <motion.button
                      key={t.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setItemType(t.value)}
                      className={`p-3 rounded-card border-2 flex flex-col items-center gap-1 ${
                        itemType === t.value
                          ? selectedType === 'asset'
                            ? 'border-brand-green bg-brand-green/10'
                            : 'border-brand-pink bg-brand-pink/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${
                        itemType === t.value
                          ? selectedType === 'asset' ? 'text-brand-green' : 'text-brand-pink'
                          : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        itemType === t.value
                          ? selectedType === 'asset' ? 'text-brand-green' : 'text-brand-pink'
                          : 'text-gray-400'
                      }`}>
                        {t.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Ícone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ícone
              </label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((opt) => {
                  const IconComponent = opt.icon;
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIcon(opt.value)}
                      className={`p-2 rounded-card border-2 flex items-center justify-center ${
                        icon === opt.value
                          ? 'border-brand-pink bg-brand-pink/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${
                        icon === opt.value ? 'text-brand-pink' : 'text-gray-400'
                      }`} />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent resize-none"
                placeholder="Adicione uma descrição..."
              />
            </div>

            {/* Data */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            {/* Campos específicos de Passivo */}
            {selectedType === 'liability' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Taxa de Juros (%)
                  </label>
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value.replace(/[^\d,.-]/g, ''))}
                    className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parcela Atual
                    </label>
                    <input
                      type="number"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total de Parcelas
                    </label>
                    <input
                      type="number"
                      value={totalInstallments}
                      onChange={(e) => setTotalInstallments(e.target.value)}
                      className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Observações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-card border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-pink focus:border-transparent resize-none"
                placeholder="Adicione observações..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-card bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`flex-1 px-4 py-3 rounded-card text-white font-semibold shadow-soft-shadow transition-colors ${
                  selectedType === 'asset'
                    ? 'bg-brand-green hover:bg-green-600'
                    : 'bg-brand-pink hover:bg-pink-600'
                }`}
              >
                {item ? 'Salvar' : 'Adicionar'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

