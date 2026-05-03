import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getRiskColor, getRiskLevel, getRiskLabel } from '@/lib/risk';

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export function RiskGauge({ score, size = 220 }: RiskGaugeProps) {
  const level = getRiskLevel(score);
  const color = getRiskColor(level);
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  const motionScore = useMotionValue(0);
  const dashOffset = useTransform(motionScore, (v) => circumference * (1 - v / 100));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionScore, score, { duration: 1.2, ease: 'easeOut' });
    const unsub = motionScore.on('change', (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, motionScore]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={14}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl text-navy-900" style={{ color }}>
          {display}%
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-wider text-navy-300">
          {getRiskLabel(level)}
        </span>
      </div>
    </div>
  );
}
