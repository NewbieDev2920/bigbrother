import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { BudgetEstimationData } from '@/types/dashboard';
import { chartTheme, tooltipStyle, tooltipLabelStyle } from './theme';

interface Props {
  data: BudgetEstimationData;
  height?: number;
}

function fmt(v: number) {
  return `${v.toFixed(0)}B COP`;
}

export function GaussianChart({ data, height = 280 }: Props) {
  const deviation = ((data.actualValue - data.mean) / data.mean) * 100;
  const isOverBudget = data.actualValue > data.mean;

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data.points} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="gaussGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.secondary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={chartTheme.secondary} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
          <XAxis
            dataKey="x"
            tickFormatter={fmt}
            tick={{ fill: chartTheme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: chartTheme.grid }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v) => [Number(v).toFixed(5), 'Probability']}
            labelFormatter={(l) => `Value: ${fmt(Number(l))}`}
          />
          {/* Mean line */}
          <ReferenceLine
            x={data.mean}
            stroke={chartTheme.primary}
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{ value: `Mean ${fmt(data.mean)}`, fill: chartTheme.primary, fontSize: 11, position: 'top' }}
          />
          {/* Actual value */}
          <ReferenceLine
            x={data.actualValue}
            stroke={isOverBudget ? '#C73E3E' : '#2D8F5F'}
            strokeWidth={2.5}
            label={{
              value: `Actual ${fmt(data.actualValue)}`,
              fill: isOverBudget ? '#C73E3E' : '#2D8F5F',
              fontSize: 11,
              position: 'insideTopRight',
            }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke={chartTheme.secondary}
            strokeWidth={2}
            fill="url(#gaussGrad)"
            dot={false}
            activeDot={{ r: 3, fill: chartTheme.secondary }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <Stat label="Expected (mean)" value={fmt(data.mean)} />
        <Stat label="Std deviation" value={`± ${fmt(data.stdDev)}`} />
        <Stat
          label="Actual value"
          value={fmt(data.actualValue)}
          className={isOverBudget ? 'text-risk-high' : 'text-risk-low'}
        />
        <Stat
          label="Deviation"
          value={`${isOverBudget ? '+' : ''}${deviation.toFixed(1)}%`}
          className={isOverBudget ? 'text-risk-high font-semibold' : 'text-risk-low font-semibold'}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, className = 'text-navy-900' }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-navy-300">{label}</span>
      <span className={`font-mono text-sm font-medium ${className}`}>{value}</span>
    </div>
  );
}
