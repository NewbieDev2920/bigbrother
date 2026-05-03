import { Link } from 'react-router-dom';
import { ChevronRight, DollarSign, HardHat, Clock, FileSearch, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AspectKey, AspectScore } from '@/types/analysis';
import { ASPECT_LABELS } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { BudgetChart } from '@/components/charts/BudgetChart';
import { ContractorRadar } from '@/components/charts/ContractorRadar';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { TransparencyHeatmap } from '@/components/charts/TransparencyHeatmap';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { scoreToRiskLevel, getRiskColorClasses } from '@/lib/risk';
import { cn } from '@/lib/cn';

interface AnalysisCardProps {
  projectId: string;
  aspect: AspectKey;
  score: AspectScore;
}

const icons: Record<AspectKey, LucideIcon> = {
  presupuesto: DollarSign,
  contratista: HardHat,
  tiempo: Clock,
  transparencia: FileSearch,
  avance: TrendingUp,
};

function MiniChart({ aspect, chartData, height = 110 }: { aspect: AspectKey; chartData: Record<string, unknown>; height?: number }) {
  switch (aspect) {
    case 'presupuesto':
      return <BudgetChart data={(chartData.series as never) ?? []} height={height} />;
    case 'contratista':
      return <ContractorRadar data={(chartData.radar as never) ?? []} height={height} />;
    case 'tiempo':
      return <TimelineChart data={(chartData.timeline as never) ?? []} height={height} />;
    case 'transparencia':
      return <TransparencyHeatmap data={(chartData.grid as never) ?? []} height={height} />;
    case 'avance':
      return <ProgressChart data={(chartData.monthly as never) ?? []} height={height} />;
  }
}

export function AnalysisCard({ projectId, aspect, score }: AnalysisCardProps) {
  const Icon = icons[aspect];
  const level = scoreToRiskLevel(score.score);
  const c = getRiskColorClasses(level);

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-navy-700">
          <span className={cn('rounded-lg p-1.5', c.bg, c.text)}>
            <Icon size={16} />
          </span>
          <h3 className="font-serif text-sm font-semibold text-navy-900">{ASPECT_LABELS[aspect]}</h3>
        </div>
        <span className={cn('font-mono text-sm font-semibold', c.text)}>{score.score}/100</span>
      </div>
      <div className="mb-3">
        <MiniChart aspect={aspect} chartData={score.chartData} />
      </div>
      <p className="mb-3 line-clamp-2 text-xs text-navy-300">{score.resumen}</p>
      <Link
        to={`/proyecto/${projectId}/aspecto/${aspect}`}
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-royal-600 hover:text-royal-400"
      >
        Ver más detalles <ChevronRight size={14} />
      </Link>
    </Card>
  );
}

export { MiniChart as AspectChart };
