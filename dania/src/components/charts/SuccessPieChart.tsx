import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chartTheme, tooltipStyle } from './theme';

interface Props {
  won: number;
  participated: number;
  height?: number;
}

export function SuccessPieChart({ won, participated, height = 220 }: Props) {
  const lost = participated - won;
  const data = [
    { name: 'Won', value: won },
    { name: 'Did not win', value: lost },
  ];
  const COLORS = [chartTheme.secondary, chartTheme.grid];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? chartTheme.secondary : '#CBD5E1'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span style={{ color: chartTheme.axis, fontSize: 12 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
