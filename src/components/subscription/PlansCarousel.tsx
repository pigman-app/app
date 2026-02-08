import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { plans, userSettings } from '../../mocks/settings';
import PlanCard from './PlanCard';

interface PlansCarouselProps {
  onUpgrade?: (planId: string) => void;
}

export default function PlansCarousel({ onUpgrade }: PlansCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : plans.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < plans.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Planos de Assinatura
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Escolha o plano ideal para sua jornada financeira
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-visible" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * 100}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className="w-full flex-shrink-0"
                style={{ minWidth: '100%' }}
              >
                <PlanCard
                  plan={plan}
                  isCurrent={plan.name === userSettings.currentPlan}
                  onUpgrade={onUpgrade}
                  index={index}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {plans.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-brand-pink w-6'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}



