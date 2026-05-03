import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { chartTheme, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './theme';

interface ProgressChartProps {
  data: { mes: string; real: number; reportado: number }[];
  height?: number;
  showLegend?: boolean;
}

export function ProgressChart({ data, height = 120, showLegend = false }: ProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: chartTheme.axis, fontSize: 11 }} stroke={chartTheme.axis} />
        <YAxis tick={{ fill: chartTheme.axis, fontSize: 11 }} stroke={chartTheme.axis} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        <Bar dataKey="real" name="Avance real" fill={chartTheme.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="reportado" name="Avance reportado" fill={chartTheme.accent} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
