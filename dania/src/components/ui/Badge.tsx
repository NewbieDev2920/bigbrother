import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type BadgeColor = 'navy' | 'royal' | 'ember' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  navy: 'bg-navy-50 text-navy-900 border-navy-100',
  royal: 'bg-royal-400/15 text-royal-600 border-royal-400/30',
  ember: 'bg-ember-300/20 text-ember-500 border-ember-300/40',
  neutral: 'bg-canvas-border/50 text-navy-700 border-canvas-border',
};

export function Badge({ color = 'navy', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}
