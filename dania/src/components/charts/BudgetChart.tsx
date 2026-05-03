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

interface BudgetChartProps {
  data: { name: string; estudio: number; contrato: number; mercado: number }[];
  height?: number;
  showLegend?: boolean;
}

export function BudgetChart({ data, height = 120, showLegend = false }: BudgetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: chartTheme.axis, fontSize: 11 }} stroke={chartTheme.axis} />
        <YAxis tick={{ fill: chartTheme.axis, fontSize: 11 }} stroke={chartTheme.axis} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        <Bar dataKey="estudio" name="Estudio previo" fill={chartTheme.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="contrato" name="Contrato" fill={chartTheme.secondary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="mercado" name="Mercado" fill={chartTheme.accent} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
