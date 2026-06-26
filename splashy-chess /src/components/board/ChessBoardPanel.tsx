'use client';

import { useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { motion } from 'framer-motion';
import {
  SkipBack, SkipForward, ChevronLeft, ChevronRight, RotateCcw,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { EvalBar } from '@/components/ui/EvalBar';
import type { Square } from 'chess.js';

interface ChessBoardPanelProps {
  flipped?: boolean;
  onFlip?: () => void;
}

export function ChessBoardPanel({ flipped = false, onFlip }: ChessBoardPanelProps) {
  const {
    fens, currentIndex, annotatedMoves,
    goForward, goBackward, goToStart, goToEnd, goToMove,
  } = useGameStore();

  const currentFen = fens[currentIndex] ?? fens[0];
  const currentMove = annotatedMoves[currentIndex - 1]; // index 0 = start position

  // Arrow for best move vs played move
  const arrows = useMemo((): [Square, Square, string?][] => {
    if (!currentMove?.evalBefore?.bestMove) return [];
    const bm = currentMove.evalBefore.bestMove;
    if (bm.length < 4) return [];
    const from = bm.slice(0, 2) as Square;
    const to   = bm.slice(2, 4) as Square;
    return [[from, to, 'rgba(201,168,76,0.5)']];
  }, [currentMove]);

  // Highlight last move squares
  const customSquareStyles = useMemo(() => {
    if (!currentMove) return {};
    const uci = currentMove.uci;
    if (!uci || uci.length < 4) return {};
    const from = uci.slice(0, 2) as Square;
    const to   = uci.slice(2, 4) as Square;

    const color = currentMove.classification
      ? {
          blunder:    'rgba(224,82,82,0.35)',
          mistake:    'rgba(224,122,82,0.3)',
          inaccuracy: 'rgba(212,188,68,0.28)',
          brilliant:  'rgba(78,158,232,0.3)',
          best:       'rgba(82,183,136,0.28)',
          excellent:  'rgba(82,183,136,0.2)',
          good:       'rgba(201,168,76,0.15)',
          miss:       'rgba(224,122,82,0.2)',
        }[currentMove.classification]
      : 'rgba(201,168,76,0.2)';

    return {
      [from]: { backgroundColor: 'rgba(201,168,76,0.2)' },
      [to]:   { backgroundColor: color },
    };
  }, [currentMove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goForward();
    if (e.key === 'ArrowLeft')  goBackward();
    if (e.key === 'ArrowUp')    goToStart();
    if (e.key === 'ArrowDown')  goToEnd();
  }, [goForward, goBackward, goToStart, goToEnd]);

  const canGoBack    = currentIndex > 0;
  const canGoForward = currentIndex < fens.length - 1;

  return (
    <div className="flex gap-3 items-start justify-center">
      {/* Eval bar */}
      <EvalBar
        evaluation={currentMove?.evalAfter ?? currentMove?.evalBefore}
        height={300}
        className="hidden sm:flex pt-2"
      />

      {/* Board + controls */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[420px]">
        {/* Player label — Black */}
        <div className="w-full flex items-center justify-between px-1">
          <span className="text-xs text-cream-muted font-medium">Black</span>
          {currentMove?.color === 'b' && currentMove.classification && (
            <span className="text-[10px] font-mono font-semibold" style={{
              color: ({ blunder:'#E05252', mistake:'#E07A52', inaccuracy:'#D4BC44', brilliant:'#4E9EE8', best:'#52B788', excellent:'#52B788', good:'#9A8F7E', miss:'#E07A52' } as any)[currentMove.classification]
            }}>
              {currentMove.san} {({ blunder:'??', mistake:'?', inaccuracy:'?!', brilliant:'!!', best:'★', excellent:'✓', good:'', miss:'✗' } as any)[currentMove.classification]}
            </span>
          )}
        </div>

        {/* Board */}
        <div
          className="chess-board-wrapper w-full rounded-2xl overflow-hidden shadow-gold border border-gold-border/20 focus:outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ aspectRatio: '1' }}
        >
          <Chessboard
            position={currentFen}
            boardOrientation={flipped ? 'black' : 'white'}
            customDarkSquareStyle={{ backgroundColor: '#4a3728' }}
            customLightSquareStyle={{ backgroundColor: '#c8b89a' }}
            customSquareStyles={customSquareStyles}
            customArrows={arrows}
            areArrowsAllowed={false}
            isDraggablePiece={() => false}
            animationDuration={150}
          />
        </div>

        {/* Player label — White */}
        <div className="w-full flex items-center justify-between px-1">
          <span className="text-xs text-cream-muted font-medium">White</span>
          {currentMove?.color === 'w' && currentMove.classification && (
            <span className="text-[10px] font-mono font-semibold" style={{
              color: ({ blunder:'#E05252', mistake:'#E07A52', inaccuracy:'#D4BC44', brilliant:'#4E9EE8', best:'#52B788', excellent:'#52B788', good:'#9A8F7E', miss:'#E07A52' } as any)[currentMove.classification]
            }}>
              {currentMove.san} {({ blunder:'??', mistake:'?', inaccuracy:'?!', brilliant:'!!', best:'★', excellent:'✓', good:'', miss:'✗' } as any)[currentMove.classification]}
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <NavBtn onClick={goToStart}   disabled={!canGoBack}    label="Start">    <SkipBack    size={14} /></NavBtn>
          <NavBtn onClick={goBackward}  disabled={!canGoBack}    label="Previous"> <ChevronLeft size={14} /></NavBtn>
          <span className="text-xs text-cream-faint min-w-[60px] text-center tabular-nums">
            {currentIndex}/{fens.length - 1}
          </span>
          <NavBtn onClick={goForward}   disabled={!canGoForward} label="Next">     <ChevronRight size={14}/></NavBtn>
          <NavBtn onClick={goToEnd}     disabled={!canGoForward} label="End">      <SkipForward  size={14}/></NavBtn>
          {onFlip && (
            <NavBtn onClick={onFlip} label="Flip board">
              <RotateCcw size={14} />
            </NavBtn>
          )}
        </div>

        {/* Move progress scrubber */}
        {fens.length > 1 && (
          <input
            type="range"
            min={0}
            max={fens.length - 1}
            value={currentIndex}
            onChange={e => goToMove(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C9A84C ${(currentIndex / (fens.length - 1)) * 100}%, rgba(255,255,255,0.08) 0%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, children, label }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-gold-border/30 text-cream-muted hover:text-gold-500 hover:border-gold-border hover:bg-gold-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
    >
      {children}
    </motion.button>
  );
}
