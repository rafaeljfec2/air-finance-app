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
  readonly onClick?: () => void;
  readonly isActive?: boolean;
  readonly disabled?: boolean;
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

function getCardStatClasses({
  positive,
  negative,
  highlight,
  blue,
  compact,
  isActive,
  isInteractive,
}: {
  readonly positive?: boolean;
  readonly negative?: boolean;
  readonly highlight?: boolean;
  readonly blue?: boolean;
  readonly compact?: boolean;
  readonly isActive?: boolean;
  readonly isInteractive: boolean;
}): {
  readonly containerClass: string;
  readonly valueClass: string;
  readonly paddingClass: string;
} {
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

  if (isActive) {
    containerClass = `${containerClass} ring-2 ring-primary-500/70 dark:ring-primary-400/70`;
  }

  if (isInteractive) {
    containerClass = `${containerClass} cursor-pointer hover:brightness-105 dark:hover:brightness-110`;
  }

  const paddingClass = compact ? 'p-2 sm:p-2.5' : 'p-3';

  return { containerClass, valueClass, paddingClass };
}

export const CardStat: React.FC<CardStatProps> = ({
  label,
  value,
  positive,
  negative,
  highlight,
  blue,
  compact,
  onClick,
  isActive = false,
  disabled = false,
}) => {
  const isInteractive = Boolean(onClick) && !disabled;
  const { containerClass, valueClass, paddingClass } = getCardStatClasses({
    positive,
    negative,
    highlight,
    blue,
    compact,
    isActive,
    isInteractive,
  });

  const content = (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className={valueClass}>
        R$ <AnimatedValue value={value} />
      </span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        aria-pressed={isActive}
        onClick={onClick}
        className={`flex w-full flex-col gap-1 text-left ${paddingClass} rounded-lg ${containerClass} transition-colors`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`flex flex-col gap-1 ${paddingClass} rounded-lg ${containerClass} transition-colors`}
    >
      {content}
    </div>
  );
};
