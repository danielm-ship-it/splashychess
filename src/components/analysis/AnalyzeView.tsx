'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { PgnImporter } from '@/components/import/PgnImporter';
import { ChessBoardPanel } from '@/components/board/ChessBoardPanel';
import { MoveList } from '@/components/board/MoveList';
import { AnalysisPanel } from '@/components/analysis/AnalysisPanel';
import { AccuracyStats } from '@/components/analysis/AccuracyStats';
import { OpeningInfo } from '@/components/analysis/OpeningInfo';
import { Button } from '@/components/ui/Button';

export function AnalyzeView() {
  const { pgn, resetGame, analysisStatus, accuracyStats } = useGameStore();
  const [flipped, setFlipped] = useState(false);
  const [showImport, setShowImport] = useState(true);
  const [showMoves, setShowMoves] = useState(true);

  const hasGame = !!pgn;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">

      {/* ── Left Panel ─────────────────────────────────────────── */}
      <div className="lg:w-72 xl:w-80 flex flex-col gap-3 shrink-0">

        {/* Import card */}
        <div className="glass rounded-2xl p-4">
          <button
            className="w-full flex items-center justify-between mb-0"
            onClick={() => setShowImport(v => !v)}
          >
            <span className="text-xs font-semibold text-cream-muted uppercase tracking-wider">
              Import
            </span>
            {showImport ? <ChevronUp size={14} className="text-cream-faint" /> : <ChevronDown size={14} className="text-cream-faint" />}
          </button>
          <AnimatePresence>
            {showImport && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <PgnImporter />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Opening */}
        {hasGame && <OpeningInfo />}

        {/* Analysis */}
        {hasGame && (
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-semibold text-cream-muted uppercase tracking-wider mb-3">Engine Analysis</p>
            <AnalysisPanel />
          </div>
        )}

        {/* Accuracy stats */}
        {accuracyStats && (
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-semibold text-cream-muted uppercase tracking-wider mb-3">Accuracy</p>
            <AccuracyStats />
          </div>
        )}

        {/* Reset */}
        {hasGame && (
          <Button
            variant="subtle"
            size="sm"
            icon={<RotateCcw size={13} />}
            onClick={() => { resetGame(); setShowImport(true); }}
            className="self-start text-cream-faint"
          >
            New Game
          </Button>
        )}
      </div>

      {/* ── Right Panel ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-w-0">

        {/* Board */}
        <div className="flex-1 flex items-start justify-center">
          {hasGame ? (
            <div className="w-full max-w-[480px]">
              <ChessBoardPanel flipped={flipped} onFlip={() => setFlipped(f => !f)} />
            </div>
          ) : (
            <EmptyBoard />
          )}
        </div>

        {/* Move list */}
        {hasGame && (
          <div className="lg:w-52 xl:w-60 flex flex-col glass rounded-2xl overflow-hidden">
            <button
              className="flex items-center justify-between px-4 py-3 border-b border-gold-border/20 hover:bg-white/5 transition-colors"
              onClick={() => setShowMoves(v => !v)}
            >
              <span className="text-xs font-semibold text-cream-muted uppercase tracking-wider">Moves</span>
              {showMoves ? <ChevronUp size={14} className="text-cream-faint" /> : <ChevronDown size={14} className="text-cream-faint" />}
            </button>
            <AnimatePresence>
              {showMoves && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden flex-1"
                >
                  <div className="p-3 h-[400px] lg:h-full overflow-y-auto">
                    <MoveList />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyBoard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[420px] aspect-square rounded-2xl border border-dashed border-gold-border/30 flex flex-col items-center justify-center gap-3 text-center p-8"
    >
      <div className="text-6xl opacity-20">♛</div>
      <div>
        <p className="text-sm font-semibold text-cream-muted">No game loaded</p>
        <p className="text-xs text-cream-faint mt-1">Import a PGN to get started</p>
      </div>
    </motion.div>
  );
}
