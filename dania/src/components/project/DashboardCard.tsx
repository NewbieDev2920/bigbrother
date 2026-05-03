import { Link } from 'react-router-dom';
import { ChevronRight, BarChart3, HardHat, Building2, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { DashboardKey } from '@/types/dashboard';

const ICONS: Record<DashboardKey, LucideIcon> = {
  global: BarChart3,
  contractor: HardHat,
  entity: Building2,
  budget: TrendingUp,
};

const DESCRIPTIONS: Record<DashboardKey, string> = {
  global: 'Distribution of contract values and types across all public procurement.',
  contractor: 'Company age, contract history, success rate, advance and execution ratios.',
  entity: 'Market concentration index (HHI) and top contractors awarded by this entity.',
  budget: 'Statistical estimate of expected contract value vs. actual awarded price.',
};

const ACCENT: Record<DashboardKey, string> = {
  global: 'bg-navy-700/10 text-navy-700',
  contractor: 'bg-royal-600/10 text-royal-600',
  entity: 'bg-ember-500/10 text-ember-500',
  budget: 'bg-risk-low/10 text-risk-low',
};

interface Props {
  projectId: string;
  dashboardKey: DashboardKey;
  title: string;
}

export function DashboardCard({ projectId, dashboardKey, title }: Props) {
  const Icon = ICONS[dashboardKey];
  const accent = ACCENT[dashboardKey];

  return (
    <Card className="group flex flex-col p-5 transition-shadow hover:shadow-card-lg">
      <div className="mb-3 flex items-start gap-3">
        <span className={`rounded-xl p-2.5 ${accent}`}>
          <Icon size={20} />
        </span>
        <div className="flex-1">
          <h3 className="font-serif text-sm font-semibold text-navy-900">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-navy-300">{DESCRIPTIONS[dashboardKey]}</p>
        </div>
      </div>
      <Link
        to={`/proyecto/${projectId}/dashboard/${dashboardKey}`}
        className="mt-auto inline-flex items-center gap-1 self-end text-sm font-medium text-royal-600 transition-colors hover:text-royal-400"
      >
        View more <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
  );
}
