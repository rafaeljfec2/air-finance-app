import { motion, useSpring, useTransform } from 'framer-motion';
import React, { useEffect } from 'react';

interface CardStatProps {
  readonly label: string;
  readonly value: number;
  readonly positive?: boolean;
  readonly negative?: boolean;
  readonly highlight?: boolean;
  readonly blue?: boolean;
  readonly compact?: boolean;
}

function AnimatedValue({ value }: Readonly<{ value: number }>) {
  const spring = useSpring(0, { bounce: 0, duration: 1000 });
  const display = useTransform(spring, (current) =>
    current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export const CardStat: React.FC<CardStatProps> = ({
  label,
  value,
  positive,
  negative,
  highlight,
  blue,
  compact,
}) => {
  const textSize = compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl';
  let valueClass = `font-bold ${textSize} text-text dark:text-text-dark`;
  let containerClass = 'bg-gray-100 dark:bg-gray-800/50';

  if (positive) {
    valueClass = `font-bold ${textSize} text-emerald-600 dark:text-emerald-400`;
    containerClass = 'bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/10';
  } else if (negative) {
    valueClass = `font-bold ${textSize} text-red-600 dark:text-red-400`;
    containerClass = 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/10';
  } else if (highlight) {
    valueClass = `font-bold ${textSize} text-primary-600 dark:text-primary-400`;
    containerClass = 'bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/10';
  } else if (blue) {
    valueClass = `font-bold ${textSize} text-blue-600 dark:text-blue-400`;
    containerClass = 'bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/10';
  }

  const paddingClass = compact ? 'p-2 sm:p-2.5' : 'p-3';

  return (
    <div
      className={`flex flex-col gap-1 ${paddingClass} rounded-lg ${containerClass} transition-colors`}
    >
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className={valueClass}>
        R$ <AnimatedValue value={value} />
      </span>
    </div>
  );
};
