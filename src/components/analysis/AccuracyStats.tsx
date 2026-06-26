'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { MOVE_CLASS_META } from '@/lib/chess-utils';
import type { PlayerStats } from '@/types';

const CATS = ['brilliant', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder'] as const;

export function AccuracyStats() {
  const { accuracyStats } = useGameStore();
  if (!accuracyStats) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <PlayerCard label="White" stats={accuracyStats.white} />
      <PlayerCard label="Black" stats={accuracyStats.black} />
    </div>
  );
}

function PlayerCard({ label, stats }: { label: string; stats: PlayerStats }) {
  const { accuracy } = stats;

  // Accuracy colour: green > 80, amber 60-80, red < 60
  const accColor = accuracy >= 80 ? '#52B788' : accuracy >= 60 ? '#D4BC44' : '#E05252';

  return (
    <div className="glass-subtle rounded-xl p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cream-DEFAULT">{label}</span>
        <div className="text-right">
          <motion.span
            className="text-lg font-display font-bold tabular-nums leading-none"
            style={{ color: accColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {accuracy}%
          </motion.span>
          <p className="text-[9px] text-cream-faint">accuracy</p>
        </div>
      </div>

      {/* Accuracy ring */}
      <AccuracyRing pct={accuracy} color={accColor} />

      {/* Move breakdown */}
      <div className="space-y-1">
        {CATS.map(cat => {
          const count = stats[cat as keyof PlayerStats] as number;
          if (!count) return null;
          const meta = MOVE_CLASS_META[cat];
          return (
            <div key={cat} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold" style={{ color: meta.color }}>{meta.symbol || '·'}</span>
                <span className="text-cream-muted">{meta.label}</span>
              </div>
              <span className="font-mono font-semibold tabular-nums" style={{ color: meta.color }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Avg cp loss */}
      <div className="pt-1 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-cream-faint">Avg centipawn loss</span>
          <span className="font-mono text-cream-muted">{stats.averageCpLoss}</span>
        </div>
      </div>
    </div>
  );
}

function AccuracyRing({ pct, color }: { pct: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex justify-center">
      <svg width={52} height={52} viewBox="0 0 52 52">
        {/* Track */}
        <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        {/* Fill */}
        <motion.circle
          cx={26} cy={26} r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform="rotate(-90 26 26)"
        />
        <text x={26} y={30} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={color} fontWeight="bold">
          {pct}%
        </text>
      </svg>
    </div>
  );
}
