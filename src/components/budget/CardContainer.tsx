import { motion } from 'framer-motion';
import React from 'react';

interface CardContainerProps {
  color?: 'emerald' | 'amber' | 'rose' | 'violet';
  children: React.ReactNode;
  className?: string;
}



export const CardContainer: React.FC<CardContainerProps> = ({
  color = 'emerald',
  children,
  className,
}) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`
      bg-card dark:bg-card-dark 
      rounded-2xl shadow-sm hover:shadow-xl 
      border border-border dark:border-border-dark 
      transition-all duration-300
      relative overflow-hidden
      p-6 flex flex-col h-full w-full 
      ${className ?? ''}
    `}
  >
    <div className={`absolute top-0 left-0 right-0 h-1 bg-${color}-500 opacity-80`} />
    {children}
  </motion.div>
);
