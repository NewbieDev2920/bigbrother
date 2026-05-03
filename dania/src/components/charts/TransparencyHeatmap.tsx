interface TransparencyHeatmapProps {
  data: { doc: string; score: number }[];
  height?: number;
}

const cellColor = (score: number) => {
  if (score >= 0.7) return '#2D8F5F';
  if (score >= 0.4) return '#E8B82B';
  return '#C73E3E';
};

export function TransparencyHeatmap({ data, height = 120 }: TransparencyHeatmapProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5" style={{ minHeight: height }}>
      {data.map((d) => (
        <div
          key={d.doc}
          className="group relative flex aspect-square flex-col items-center justify-center rounded-md text-[9px] font-medium text-white"
          style={{ backgroundColor: cellColor(d.score), opacity: 0.45 + d.score * 0.55 }}
          title={`${d.doc}: ${(d.score * 100).toFixed(0)}%`}
        >
          <span className="font-mono">{(d.score * 100).toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
}
