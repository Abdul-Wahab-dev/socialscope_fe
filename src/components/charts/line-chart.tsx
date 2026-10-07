'use client';

import { useMemo, useState } from 'react';
import { formatCompact, formatDate } from '@/lib/utils';

export interface Series {
  name: string;
  color: string;
  points: { x: Date; y: number }[];
}

/** Dependency-free responsive SVG line chart with hover readout. */
export function LineChart({ series, height = 220 }: { series: Series[]; height?: number }) {
  const [hover, setHover] = useState<{ x: number; label: string } | null>(null);
  const W = 640;
  const H = height;
  const pad = { l: 48, r: 12, t: 12, b: 28 };

  const { xs, minX, maxX, maxY } = useMemo(() => {
    const all = series.flatMap((s) => s.points);
    const xs = [...new Set(all.map((p) => p.x.getTime()))].sort((a, b) => a - b);
    return {
      xs,
      minX: xs[0] ?? 0,
      maxX: xs[xs.length - 1] ?? 1,
      maxY: Math.max(1, ...all.map((p) => p.y)) * 1.1,
    };
  }, [series]);

  if (!xs.length) return <p className="py-8 text-center text-sm text-zinc-500">Not enough data yet — stats are captured on every sync.</p>;

  const sx = (t: number) => pad.l + ((t - minX) / Math.max(1, maxX - minX)) * (W - pad.l - pad.r);
  const sy = (v: number) => H - pad.b - (v / maxY) * (H - pad.t - pad.b);
  const ticks = [0, 0.5, 1].map((f) => maxY * f);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Follower history chart"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const nearest = xs.reduce((best, t) => (Math.abs(sx(t) - px) < Math.abs(sx(best) - px) ? t : best), xs[0]!);
          const parts = series
            .map((s) => {
              const p = s.points.find((pt) => pt.x.getTime() === nearest);
              return p ? `${s.name}: ${formatCompact(p.y)}` : null;
            })
            .filter(Boolean);
          setHover({ x: sx(nearest), label: `${formatDate(new Date(nearest))} · ${parts.join(' · ')}` });
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(t)} y2={sy(t)} stroke="#e4e4e7" strokeDasharray="3 3" />
            <text x={pad.l - 6} y={sy(t) + 4} textAnchor="end" fontSize="11" fill="#71717a">
              {formatCompact(t)}
            </text>
          </g>
        ))}
        <text x={pad.l} y={H - 6} fontSize="11" fill="#71717a">
          {formatDate(new Date(minX))}
        </text>
        <text x={W - pad.r} y={H - 6} fontSize="11" fill="#71717a" textAnchor="end">
          {formatDate(new Date(maxX))}
        </text>
        {series.map((s) => (
          <g key={s.name}>
          <polyline
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={s.points.map((p) => `${sx(p.x.getTime())},${sy(p.y)}`).join(' ')}
          />
          {s.points.map((p) => (
            <circle key={p.x.getTime()} cx={sx(p.x.getTime())} cy={sy(p.y)} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />
          ))}
          </g>
        ))}
        {hover && <line x1={hover.x} x2={hover.x} y1={pad.t} y2={H - pad.b} stroke="#a1a1aa" />}
      </svg>
      <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
        <div className="flex gap-3">
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
        {hover && <span className="tabular-nums">{hover.label}</span>}
      </div>
    </div>
  );
}
