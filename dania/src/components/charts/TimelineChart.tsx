import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { chartTheme, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './theme';

interface TimelineChartProps {
  data: { hito: string; mes: number; planeado: number; real: number }[];
  height?: number;
}

export function TimelineChart({ data, height = 120 }: TimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
        <XAxis dataKey="hito" tick={{ fill: chartTheme.axis, fontSize: 10 }} stroke={chartTheme.axis} />
        <YAxis tick={{ fill: chartTheme.axis, fontSize: 11 }} stroke={chartTheme.axis} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
        <Area type="monotone" dataKey="planeado" name="Planeado" stroke={chartTheme.primary} fill={chartTheme.primary} fillOpacity={0.15} />
        <Line type="monotone" dataKey="real" name="Real" stroke={chartTheme.accent} strokeWidth={2.5} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
