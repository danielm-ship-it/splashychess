'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import type { Evaluation } from '@/types';

interface StockfishHook {
  ready: boolean;
  evaluatePosition: (fen: string, depth?: number) => Promise<Evaluation>;
  findBestMove: (fen: string, depth?: number) => Promise<string>;
  stopSearch: () => void;
}

export function useStockfish(): StockfishHook {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const pendingRef = useRef<{
    resolve: (val: Evaluation) => void;
    reject: (err: Error) => void;
    bestMoveResolve?: (uci: string) => void;
  } | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || typeof window === 'undefined') return;
    initRef.current = true;

    try {
      const worker = new Worker('/stockfish.js');
      workerRef.current = worker;

      let latestEval: Evaluation | null = null;

      worker.onmessage = (e: MessageEvent<string>) => {
        const line = e.data;

        if (line === 'uciok') {
          worker.postMessage('isready');
          return;
        }

        if (line === 'readyok') {
          setReady(true);
          return;
        }

        // Parse "info depth N score cp|mate X pv ..."
        if (line.startsWith('info') && line.includes('score') && line.includes('depth')) {
          const depthMatch = line.match(/depth (\d+)/);
          const cpMatch    = line.match(/score cp (-?\d+)/);
          const mateMatch  = line.match(/score mate (-?\d+)/);
          const pvMatch    = line.match(/pv (.+)/);
          const depth = depthMatch ? parseInt(depthMatch[1]) : 0;
          const pv = pvMatch ? pvMatch[1].trim().split(' ') : [];

          if (cpMatch) {
            latestEval = { type: 'cp', value: parseInt(cpMatch[1]), depth, bestMove: pv[0] ?? '', pv };
          } else if (mateMatch) {
            latestEval = { type: 'mate', value: parseInt(mateMatch[1]), depth, bestMove: pv[0] ?? '', pv };
          }
          return;
        }

        // "bestmove e2e4 ponder ..."
        if (line.startsWith('bestmove') && pendingRef.current) {
          const parts = line.split(' ');
          const bestUci = parts[1] ?? '';

          if (latestEval) latestEval.bestMove = bestUci;

          const evalResult: Evaluation = latestEval ?? {
            type: 'cp', value: 0, depth: 0, bestMove: bestUci, pv: [bestUci],
          };

          pendingRef.current.resolve(evalResult);
          if (pendingRef.current.bestMoveResolve) {
            pendingRef.current.bestMoveResolve(bestUci);
          }
          pendingRef.current = null;
          latestEval = null;
        }
      };

      worker.onerror = (err) => {
        console.error('[Stockfish] Worker error:', err);
        if (pendingRef.current) {
          pendingRef.current.reject(new Error('Stockfish worker error'));
          pendingRef.current = null;
        }
      };

      worker.postMessage('uci');
      worker.postMessage('setoption name Hash value 32');
      worker.postMessage('setoption name Threads value 1');
    } catch (err) {
      console.error('[Stockfish] Failed to create worker:', err);
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const evaluatePosition = useCallback(
    (fen: string, depth = 18): Promise<Evaluation> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current || !ready) {
          reject(new Error('Stockfish not ready'));
          return;
        }
        // Cancel any existing search
        if (pendingRef.current) {
          workerRef.current.postMessage('stop');
          pendingRef.current.reject(new Error('Cancelled'));
        }
        pendingRef.current = { resolve, reject };
        workerRef.current.postMessage('ucinewgame');
        workerRef.current.postMessage(`position fen ${fen}`);
        workerRef.current.postMessage(`go depth ${depth}`);
      });
    },
    [ready]
  );

  const findBestMove = useCallback(
    (fen: string, depth = 18): Promise<string> => {
      return new Promise((resolve, reject) => {
        evaluatePosition(fen, depth)
          .then(ev => resolve(ev.bestMove))
          .catch(reject);
      });
    },
    [evaluatePosition]
  );

  const stopSearch = useCallback(() => {
    workerRef.current?.postMessage('stop');
  }, []);

  return { ready, evaluatePosition, findBestMove, stopSearch };
}
