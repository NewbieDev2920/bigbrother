import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { chartTheme, tooltipStyle, tooltipLabelStyle, tooltipItemStyle } from './theme';

interface HistogramProps {
  data: { range?: string; type?: string; count: number }[];
  dataKey?: 'range' | 'type';
  color?: string;
  height?: number;
}

export function ContractHistogram({ data, dataKey = 'range', color = chartTheme.primary, height = 240 }: HistogramProps) {
  const xKey = dataKey;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: chartTheme.grid }}
        />
        <YAxis
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          itemStyle={tooltipItemStyle}
          cursor={{ fill: 'rgba(91,58,158,0.08)' }}
        />
        <Bar dataKey="count" name="Contracts" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? color : chartTheme.secondary} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
