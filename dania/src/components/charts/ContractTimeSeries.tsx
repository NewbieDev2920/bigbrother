import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import type { ContractTimePoint } from '@/types/dashboard';
import { chartTheme, tooltipStyle, tooltipLabelStyle } from './theme';

interface Props {
  data: ContractTimePoint[];
  height?: number;
}

export function ContractTimeSeries({ data, height = 240 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis
          dataKey="month"
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: chartTheme.grid }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: chartTheme.axis, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(v) => `${v}B`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(v, name) =>
            name === 'value' ? [`${Number(v)}B COP`, 'Contract value'] : [Number(v), 'Contracts']
          }
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="contracts"
          name="contracts"
          stroke={chartTheme.primary}
          strokeWidth={2}
          dot={<Dot r={4} fill={chartTheme.primary} stroke="#fff" strokeWidth={2} />}
          activeDot={{ r: 5 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="value"
          name="value"
          stroke={chartTheme.accent}
          strokeWidth={2}
          dot={<Dot r={4} fill={chartTheme.accent} stroke="#fff" strokeWidth={2} />}
          activeDot={{ r: 5 }}
          strokeDasharray="5 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
