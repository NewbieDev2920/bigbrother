import { cn } from '@/lib/cn';
import { getRiskLevel, getRiskLabel, getRiskColorClasses } from '@/lib/risk';
import type { RiskLevel } from '@/types/project';

interface RiskBadgeProps {
  score: number;
  level?: RiskLevel;
  showScore?: boolean;
  className?: string;
}

export function RiskBadge({ score, level, showScore = true, className }: RiskBadgeProps) {
  const lvl = level ?? getRiskLevel(score);
  const c = getRiskColorClasses(lvl);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        c.bg,
        c.text,
        c.border,
        className
      )}
    >
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', c.text)} style={{ backgroundColor: 'currentColor' }} />
      {getRiskLabel(lvl)}
      {showScore && <span className="font-mono text-[11px] opacity-80">{score}%</span>}
    </span>
  );
}
