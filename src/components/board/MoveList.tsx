'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { MOVE_CLASS_META } from '@/lib/chess-utils';
import type { AnnotatedMove } from '@/types';

export function MoveList() {
  const { moves, annotatedMoves, currentIndex, goToMove, analysisStatus } = useGameStore();
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active move into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentIndex]);

  if (moves.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-cream-faint">
        No moves loaded
      </div>
    );
  }

  // Group into pairs [white, black]
  const pairs: Array<[AnnotatedMove | null, AnnotatedMove | null]> = [];
  const movesCopy = [...(annotatedMoves.length ? annotatedMoves : moves.map((san, i) => ({
    index: i, san, uci: '', fen: '', fenBefore: '', moveNumber: Math.floor(i / 2) + 1,
    color: (i % 2 === 0 ? 'w' : 'b') as 'w' | 'b',
  })))];

  for (let i = 0; i < movesCopy.length; i += 2) {
    pairs.push([movesCopy[i] ?? null, movesCopy[i + 1] ?? null]);
  }

  return (
    <div className="h-full overflow-y-auto space-y-0.5 pr-1 text-sm">
      {pairs.map((pair, pairIdx) => (
        <div key={pairIdx} className="flex items-center gap-1">
          {/* Move number */}
          <span className="text-[11px] text-cream-faint tabular-nums w-6 shrink-0 text-right">
            {pairIdx + 1}.
          </span>

          {/* White move */}
          <MoveButton
            move={pair[0]}
            isActive={currentIndex === (pair[0]?.index ?? -1) + 1}
            onClick={() => pair[0] && goToMove(pair[0].index + 1)}
            isAnalyzing={analysisStatus === 'analyzing'}
            ref={currentIndex === (pair[0]?.index ?? -1) + 1 ? activeRef : null}
          />

          {/* Black move */}
          <MoveButton
            move={pair[1]}
            isActive={currentIndex === (pair[1]?.index ?? -1) + 1}
            onClick={() => pair[1] && goToMove(pair[1].index + 1)}
            isAnalyzing={analysisStatus === 'analyzing'}
            ref={currentIndex === (pair[1]?.index ?? -1) + 1 ? activeRef : null}
          />
        </div>
      ))}
    </div>
  );
}

interface MoveButtonProps {
  move: AnnotatedMove | { san: string; index: number } | null;
  isActive: boolean;
  onClick: () => void;
  isAnalyzing: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const MoveButton = ({ move, isActive, onClick, isAnalyzing, ref }: MoveButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  if (!move) return <span className="flex-1" />;

  const annotated = move as AnnotatedMove;
  const meta = annotated.classification ? MOVE_CLASS_META[annotated.classification] : null;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={[
        'flex-1 flex items-center gap-1.5 px-2 py-1 rounded text-left transition-all duration-100 min-w-0',
        isActive
          ? 'bg-gold-muted text-gold-300 shadow-[inset_2px_0_0_#C9A84C]'
          : 'text-cream-DEFAULT hover:bg-white/5',
      ].join(' ')}
    >
      <span className="text-[11px] font-mono truncate">{move.san}</span>

      {/* Classification indicator */}
      {meta && (
        <span
          className="text-[10px] font-mono font-bold shrink-0 leading-none"
          style={{ color: meta.color }}
          title={meta.label}
        >
          {meta.symbol}
        </span>
      )}

      {/* Spinner while analyzing this move */}
      {isAnalyzing && !annotated.classification && (
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-gold-500/50 shrink-0 animate-pulse"
          />
        </AnimatePresence>
      )}
    </motion.button>
  );
};
