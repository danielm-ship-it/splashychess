'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useGameAnalysis } from '@/hooks/useChessGame';
import { Button } from '@/components/ui/Button';
import { ClassificationBadge } from '@/components/ui/Badge';
import { MOVE_CLASS_META } from '@/lib/chess-utils';

export function AnalysisPanel() {
  const { analysisStatus, analysisProgress, pgn, currentIndex, annotatedMoves } = useGameStore();
  const { analyzeGame, engineReady } = useGameAnalysis();

  const currentMove = annotatedMoves[currentIndex - 1];

  const isIdle     = analysisStatus === 'idle';
  const isAnalyzing= analysisStatus === 'analyzing';
  const isComplete = analysisStatus === 'complete';
  const isError    = analysisStatus === 'error';

  const canAnalyze = !!pgn && engineReady && !isAnalyzing;

  return (
    <div className="space-y-4">
      {/* Engine status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={[
            'w-2 h-2 rounded-full',
            engineReady ? 'bg-good animate-pulse' : 'bg-cream-faint',
          ].join(' ')} />
          <span className="text-[11px] text-cream-muted">
            {engineReady ? 'Stockfish 16 ready' : 'Loading engine…'}
          </span>
        </div>
        {isComplete && (
          <span className="text-[10px] text-good flex items-center gap-1">
            <CheckCircle size={10} /> Complete
          </span>
        )}
        {isError && (
          <span className="text-[10px] text-red-400 flex items-center gap-1">
            <AlertCircle size={10} /> Error
          </span>
        )}
      </div>

      {/* Analyze button */}
      {!isComplete && (
        <Button
          variant="gold"
          size="md"
          className="w-full"
          icon={isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          onClick={analyzeGame}
          disabled={!canAnalyze}
          loading={isAnalyzing}
        >
          {isAnalyzing ? `Analyzing… ${analysisProgress}%` : 'Analyze Game'}
        </Button>
      )}

      {/* Progress bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1"
          >
            <div className="h-1.5 bg-sage-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold-gradient rounded-full"
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-cream-faint text-center">
              Evaluating position {Math.round(analysisProgress / 100 * (annotatedMoves.length || 1))} of {annotatedMoves.length || '…'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current move analysis */}
      <AnimatePresence mode="wait">
        {currentMove && (
          <motion.div
            key={currentMove.index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass-subtle rounded-xl p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cream-DEFAULT">
                  {currentMove.moveNumber}{currentMove.color === 'b' ? '…' : '.'} {currentMove.san}
                </span>
                {currentMove.classification && (
                  <ClassificationBadge classification={currentMove.classification} />
                )}
              </div>
              {currentMove.cpLoss !== undefined && currentMove.cpLoss > 0 && (
                <span className="text-[10px] font-mono text-cream-faint">
                  −{currentMove.cpLoss} cp
                </span>
              )}
            </div>

            {/* What happened */}
            {currentMove.classification && (
              <p className="text-[11px] text-cream-muted leading-relaxed">
                {MOVE_CLASS_META[currentMove.classification].description}
                {currentMove.bestMoveSan && currentMove.classification !== 'best' && currentMove.bestMoveSan !== currentMove.san && (
                  <> — best was <span className="font-mono font-semibold text-gold-500">{currentMove.bestMoveSan}</span></>
                )}
              </p>
            )}

            {/* Eval change */}
            {currentMove.evalBefore && currentMove.evalAfter && (
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <EvalPill label="Before" eval={currentMove.evalBefore} />
                <span className="text-cream-faint">→</span>
                <EvalPill label="After" eval={currentMove.evalAfter} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvalPill({ label, eval: ev }: { label: string; eval: { type: string; value: number } }) {
  const text = ev.type === 'mate'
    ? `M${ev.value}`
    : (ev.value >= 0 ? '+' : '') + (ev.value / 100).toFixed(2);
  const color = ev.type === 'mate'
    ? (ev.value > 0 ? '#52B788' : '#E05252')
    : ev.value > 30 ? '#52B788' : ev.value < -30 ? '#E05252' : '#9A8F7E';

  return (
    <div className="flex flex-col items-center">
      <span className="text-cream-faint text-[9px] uppercase tracking-wider">{label}</span>
      <span className="font-semibold" style={{ color }}>{text}</span>
    </div>
  );
}
