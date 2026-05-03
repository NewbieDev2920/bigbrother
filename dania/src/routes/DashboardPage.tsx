import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, HardHat, Building2, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { getDashboardData } from '@/data/mockDashboard';
import { ContractHistogram } from '@/components/charts/ContractHistogram';
import { SuccessPieChart } from '@/components/charts/SuccessPieChart';
import { ContractTimeSeries } from '@/components/charts/ContractTimeSeries';
import { GaussianChart } from '@/components/charts/GaussianChart';
import type { DashboardKey } from '@/types/dashboard';

const ICONS: Record<DashboardKey, LucideIcon> = {
  global: BarChart3,
  contractor: HardHat,
  entity: Building2,
  budget: TrendingUp,
};

const TITLES: Record<DashboardKey, string> = {
  global: 'Global Dashboards',
  contractor: 'Contractor Dashboard',
  entity: 'Public Entity Dashboard',
  budget: 'Budget Estimation',
};

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children, insight }: { title: string; children: React.ReactNode; insight: string }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-serif text-base font-semibold text-navy-900">{title}</h3>
      {children}
      <div className="mt-4 rounded-xl border border-royal-400/20 bg-royal-400/5 p-4">
        <p className="text-sm leading-relaxed text-navy-700">{insight}</p>
      </div>
    </Card>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-canvas-border bg-canvas p-4">
      <span className="text-xs text-navy-300">{label}</span>
      <span className="mt-1 font-mono text-2xl font-bold text-navy-900">{value}</span>
      {sub && <span className="mt-0.5 text-xs text-navy-300">{sub}</span>}
    </div>
  );
}

// ─── Dashboard views ──────────────────────────────────────────────────────────

function GlobalView({ data }: { data: ReturnType<typeof getDashboardData>['global'] }) {
  return (
    <div className="space-y-6">
      <Section
        title="Contract Value Distribution"
        insight="This histogram shows how contract values are distributed across all public procurement bids. A concentration in higher ranges can indicate preference for large contracts, which reduces competition and increases corruption risk."
      >
        <ContractHistogram data={data.contractValueHistogram} dataKey="range" />
      </Section>
      <Section
        title="Contract Type Distribution"
        insight="Direct awards and minimum-quota contracts bypass competitive selection, concentrating public resources in fewer hands. A high proportion of direct awards relative to public bids is a key red flag in procurement analysis."
      >
        <ContractHistogram data={data.contractTypeHistogram} dataKey="type" color="#5B3A9E" />
      </Section>
    </div>
  );
}

function ContractorView({ data }: { data: ReturnType<typeof getDashboardData>['contractor'] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatPill label="Company age" value={`${data.companyAge} yrs`} sub="at time of award" />
        <StatPill label="Total contracts" value={data.totalContracts} sub="awarded" />
        <StatPill label="Bids participated" value={data.contractsParticipated} />
        <StatPill label="Advance ratio" value={`${data.advanceRatio}%`} sub="reported progress" />
        <StatPill label="Execution ratio" value={`${data.executionRatio}%`} sub="actual vs reported" />
      </div>
      <Section
        title="Success Rate (Won vs Participated)"
        insight="A very high win rate — especially for a recently created company — suggests possible tailored bid requirements (pliegos sastre) designed to favor a specific contractor. Legitimate competition typically yields a win rate below 30–40%."
      >
        <SuccessPieChart won={data.contractsWon} participated={data.contractsParticipated} />
      </Section>
      <Section
        title="Contract History — Time Series"
        insight="The solid line tracks the number of contracts awarded per period; the dashed line shows their combined value in billion COP. A sudden spike in value with few contracts suggests abnormally large single awards, which deserve closer scrutiny."
      >
        <ContractTimeSeries data={data.timeSeries} />
        <div className="mt-2 flex gap-4 text-xs text-navy-300">
          <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4 bg-navy-700" /> Contracts (left axis)</span>
          <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-ember-500" /> Value in B COP (right axis)</span>
        </div>
      </Section>
    </div>
  );
}

function EntityView({ data }: { data: ReturnType<typeof getDashboardData>['entity'] }) {
  const hhiLevel = data.hhiIndex < 1500 ? 'Competitive' : data.hhiIndex < 2500 ? 'Moderately concentrated' : 'Highly concentrated';
  const hhiColor = data.hhiIndex < 1500 ? 'text-risk-low' : data.hhiIndex < 2500 ? 'text-risk-medium' : 'text-risk-high';

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-3 font-serif text-base font-semibold text-navy-900">Herfindahl–Hirschman Index (HHI)</h3>
        <div className="flex items-end gap-4">
          <span className={`font-mono text-5xl font-bold ${hhiColor}`}>{data.hhiIndex.toLocaleString()}</span>
          <span className={`mb-1 text-sm font-medium ${hhiColor}`}>{hhiLevel}</span>
        </div>
        <div className="mt-4 rounded-xl border border-royal-400/20 bg-royal-400/5 p-4">
          <p className="text-sm leading-relaxed text-navy-700">
            The HHI measures market concentration in public procurement. It ranges from near 0 (perfectly competitive) to 10,000 (single contractor monopoly). Values above 2,500 indicate high concentration — a strong signal that competitive processes may be compromised. The U.S. DOJ classifies markets above 2,500 as highly concentrated.
          </p>
        </div>
      </Card>
      <Section
        title="Top Contractors by Entity"
        insight="This table shows which contractors have been awarded the most contracts by this public entity. Repeated awarding to a single firm — especially in combination with a high HHI — suggests systemic bias in the selection process."
      >
        <div className="mt-2 overflow-hidden rounded-xl border border-canvas-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-canvas-border bg-canvas">
                <th className="px-4 py-3 text-left font-semibold text-navy-700">Contractor</th>
                <th className="px-4 py-3 text-right font-semibold text-navy-700">Contracts awarded</th>
              </tr>
            </thead>
            <tbody>
              {data.topContractors.map((c, i) => (
                <tr key={i} className="border-b border-canvas-border last:border-0 hover:bg-canvas transition-colors">
                  <td className="px-4 py-3 text-navy-900">{c.name}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-navy-700">{c.contracts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function BudgetView({ data }: { data: ReturnType<typeof getDashboardData>['budget'] }) {
  const deviation = ((data.actualValue - data.mean) / data.mean) * 100;
  const isOver = data.actualValue > data.mean;
  const sigmas = Math.abs((data.actualValue - data.mean) / data.stdDev);

  return (
    <div className="space-y-6">
      <Section
        title="Gaussian Budget Distribution"
        insight={`The model estimates a statistically expected contract value based on historical data for similar contracts. The actual awarded value falls ${sigmas.toFixed(1)} standard deviations ${isOver ? 'above' : 'below'} the expected mean — a ${isOver ? 'potential overpricing' : 'unusually low bid'} of ${Math.abs(deviation).toFixed(1)}%. Values beyond ±2σ are statistically rare and warrant manual review.`}
      >
        <GaussianChart data={data} />
      </Section>
      <Card className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
        <StatPill label="Expected value" value={`${data.mean}B`} sub="COP (mean)" />
        <StatPill label="Std deviation" value={`±${data.stdDev}B`} sub="COP (σ)" />
        <StatPill label="Actual value" value={`${data.actualValue}B`} sub="COP (awarded)" />
        <StatPill label="Deviation" value={`${isOver ? '+' : ''}${deviation.toFixed(1)}%`} sub={`${sigmas.toFixed(1)}σ from mean`} />
      </Card>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { id = '', dashboard = 'global' } = useParams<{ id: string; dashboard: string }>();
  const key = dashboard as DashboardKey;
  const data = getDashboardData(id);
  const Icon = ICONS[key] ?? BarChart3;
  const title = TITLES[key] ?? 'Dashboard';

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to={`/proyecto/${id}`}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <ArrowLeft size={16} />
            Back to project
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-royal-600/10 p-2.5 text-royal-600">
            <Icon size={22} />
          </span>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-navy-900">{title}</h1>
            <p className="text-sm text-navy-300">Detailed analysis · Project {id}</p>
          </div>
        </div>

        {/* Content */}
        {key === 'global' && <GlobalView data={data.global} />}
        {key === 'contractor' && <ContractorView data={data.contractor} />}
        {key === 'entity' && <EntityView data={data.entity} />}
        {key === 'budget' && <BudgetView data={data.budget} />}
      </div>
    </PageShell>
  );
}
