import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface Step {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, steps }: Readonly<StepIndicatorProps>) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const completedSteps = currentStep + 1;

  return (
    <div className="mb-8 space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-text-dark/60">
          <span className="font-medium">Progresso</span>
          <span className="font-medium">
            {completedSteps} de {steps.length}
          </span>
        </div>
        <div className="w-full h-2 bg-border-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-leaf rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Icons */}
      <div className="flex items-center justify-between relative">
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-border-dark -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={`step-${index}-${step.label}`}
              className="flex flex-col items-center gap-2 bg-transparent px-2 relative z-10"
              initial={{ scale: 1 }}
              animate={{
                scale: isCurrent ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-brand-leaf text-brand-arrow border-brand-leaf shadow-lg shadow-brand-leaf/30'
                        : isCurrent
                          ? 'bg-brand-leaf text-brand-arrow border-brand-leaf ring-4 ring-brand-leaf/20'
                          : 'bg-card-dark border-border-dark text-gray-400'
                    }`}
                whileHover={isPending ? { scale: 1.05 } : {}}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <IconComponent width={20} height={20} />
                )}
              </motion.div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isCompleted || isCurrent ? 'text-brand-leaf' : 'text-gray-400'
                } hidden sm:block`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
