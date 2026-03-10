import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  color = 'bg-emerald-500',
  className,
  height = 'h-2',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-white/10', height, className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={cn('h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]', color)}
        style={{
          boxShadow: `0 0 10px var(--tw-shadow-color)`,
        }}
      />
    </div>
  );
};
