'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useStockfish } from './useStockfish';
import { classifyMove, sanToUci, getVerboseHistory } from '@/lib/chess-utils';
import type { AnnotatedMove, Evaluation } from '@/types';

const ANALYSIS_DEPTH = 16; // Good balance of speed/accuracy for browser

export function useGameAnalysis() {
  const { ready, evaluatePosition } = useStockfish();
  const {
    pgn,
    setAnnotatedMoves,
    setAnalysisStatus,
    saveCurrentGame,
  } = useGameStore();

  const analyzeGame = useCallback(async () => {
    if (!pgn || !ready) return;

    setAnalysisStatus('analyzing', 0);

    try {
      const verboseHistory = getVerboseHistory(pgn);
      if (verboseHistory.length === 0) {
        setAnalysisStatus('error');
        return;
      }

      const annotated: AnnotatedMove[] = [];
      let prevEval: Evaluation | undefined;

      for (let i = 0; i < verboseHistory.length; i++) {
        const { san, uci, fenBefore, fenAfter, color, moveNumber } = verboseHistory[i];
        const progress = Math.round(((i + 1) / verboseHistory.length) * 100);

        // Eval before this move (use cached from last iteration)
        let evalBefore: Evaluation | undefined = prevEval;
        if (i === 0 || evalBefore === undefined) {
          try {
            evalBefore = await evaluatePosition(fenBefore, ANALYSIS_DEPTH);
          } catch {
            evalBefore = undefined;
          }
        }

        // Eval after this move
        let evalAfter: Evaluation | undefined;
        try {
          evalAfter = await evaluatePosition(fenAfter, ANALYSIS_DEPTH);
        } catch {
          evalAfter = undefined;
        }

        // Calculate centipawn loss from the side that just moved
        let cpLoss = 0;
        let bestMoveSan = evalBefore?.bestMove ?? '';

        if (evalBefore && evalAfter) {
          // Engine eval is from white's perspective; for black, negate
          const sign = color === 'w' ? 1 : -1;

          const evBefore = evalBefore.type === 'cp'
            ? evalBefore.value * sign
            : (evalBefore.value > 0 ? 10000 : -10000);

          const evAfter = evalAfter.type === 'cp'
            ? evalAfter.value * sign
            : (evalAfter.value > 0 ? -10000 : 10000);

          // After our move, the opponent gets to move, so their eval is good for them
          // cpLoss = eval_best - eval_actual (for the player who moved)
          const bestEval = evBefore;     // what the engine expected
          const actualEval = -evAfter;   // what we got (opponent's turn = negated)
          cpLoss = Math.max(0, bestEval - actualEval);
        }

        // Convert best move UCI to SAN for display
        if (bestMoveSan && evalBefore) {
          try {
            const { Chess } = await import('chess.js');
            const chess = new Chess(fenBefore);
            const move = chess.move({
              from: bestMoveSan.slice(0, 2) as any,
              to: bestMoveSan.slice(2, 4) as any,
              promotion: bestMoveSan[4] as any,
            });
            bestMoveSan = move?.san ?? bestMoveSan;
          } catch {
            /* keep UCI */
          }
        }

        const isSameBest = evalBefore?.bestMove === uci ||
          evalBefore?.bestMove?.startsWith(uci.slice(0, 4));

        const classification = isSameBest
          ? (cpLoss < 5 ? 'best' : 'excellent')
          : classifyMove(cpLoss);

        annotated.push({
          index: i,
          moveNumber,
          color,
          san,
          uci,
          fen: fenAfter,
          fenBefore,
          evalBefore,
          evalAfter,
          cpLoss: Math.round(cpLoss),
          classification,
          bestMoveSan: isSameBest ? san : bestMoveSan,
        });

        prevEval = evalAfter;
        setAnalysisStatus('analyzing', progress);
      }

      setAnnotatedMoves(annotated);
      setAnalysisStatus('complete', 100);
      saveCurrentGame();
    } catch (err) {
      console.error('[Analysis] Error:', err);
      setAnalysisStatus('error');
    }
  }, [pgn, ready, evaluatePosition, setAnnotatedMoves, setAnalysisStatus, saveCurrentGame]);

  return { analyzeGame, engineReady: ready };
}
