'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Evaluation } from '@/types';
import { cpToWinPct, formatEval } from '@/lib/chess-utils';

interface EvalBarProps {
  evaluation?: Evaluation;
  height?: number;
  className?: string;
}

export function EvalBar({ evaluation, height = 320, className = '' }: EvalBarProps) {
  const { whitePct, label, isMate } = useMemo(() => {
    if (!evaluation) return { whitePct: 50, label: '0.00', isMate: false };

    if (evaluation.type === 'mate') {
      const whiteWinning = evaluation.value > 0;
      return {
        whitePct: whiteWinning ? 97 : 3,
        label: `M${Math.abs(evaluation.value)}`,
        isMate: true,
      };
    }

    const pct = cpToWinPct(evaluation.value);
    return {
      whitePct: Math.max(3, Math.min(97, pct)),
      label: formatEval(evaluation),
      isMate: false,
    };
  }, [evaluation]);

  const blackPct = 100 - whitePct;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Eval label — black side */}
      <span className="text-[10px] font-mono font-semibold text-cream-muted tabular-nums">
        {whitePct < 50 ? label : ''}
      </span>

      {/* Bar */}
      <div
        className="relative w-5 rounded-full overflow-hidden bg-sage-elevated border border-white/5 shadow-inner"
        style={{ height }}
      >
        {/* Black portion (top) */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-[#1a1a1a]"
          animate={{ height: `${blackPct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        {/* White portion (bottom) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-[#e8e0d0]"
          animate={{ height: `${whitePct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        {/* Centre line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cream-faint/30 -translate-y-px" />
        {/* Mate flash */}
        {isMate && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ background: whitePct > 50 ? 'rgba(82,183,136,0.4)' : 'rgba(224,82,82,0.4)' }}
          />
        )}
      </div>

      {/* Eval label — white side */}
      <span className="text-[10px] font-mono font-semibold text-cream-muted tabular-nums">
        {whitePct >= 50 ? label : ''}
      </span>
    </div>
  );
}
