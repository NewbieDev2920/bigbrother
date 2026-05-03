import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { chartTheme, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './theme';

interface ContractorRadarProps {
  data: { eje: string; valor: number }[];
  height?: number;
}

export function ContractorRadar({ data, height = 120 }: ContractorRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <PolarGrid stroke={chartTheme.grid} />
        <PolarAngleAxis dataKey="eje" tick={{ fill: chartTheme.axis, fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="valor"
          stroke={chartTheme.secondary}
          fill={chartTheme.secondary}
          fillOpacity={0.35}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
